import { DatabaseErrorMiddleware } from './database-error.middleware';
import { Request, Response, NextFunction } from 'express';
import { QueryFailedError } from 'typeorm';

describe('DatabaseErrorMiddleware', () => {
  let middleware: DatabaseErrorMiddleware;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    middleware = new DatabaseErrorMiddleware();
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  it('should call next() if no error is passed', () => {
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should handle QueryFailedError with code 23505 (unique violation)', () => {
    const error = new QueryFailedError('select * from users', [], {
      code: '23505',
      detail: 'Key (email)=(test@example.com) already exists.',
    } as any);

    middleware.use(req, res, next, error);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 409,
      message: 'Unique constraint violation',
      error: 'Key (email)=(test@example.com) already exists.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle other QueryFailedError codes with a generic error message', () => {
    const error = new QueryFailedError('select * from users', [], {
      code: '23503', // foreign_key_violation
      detail: 'Foreign key violation',
    } as any);

    middleware.use(req, res, next, error);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Database error',
      error: 'An unexpected database error occurred.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle generic errors with a 500 status code', () => {
    const error = new Error('Something went wrong');

    middleware.use(req, res, next, error);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Internal server error',
      error: 'Something went wrong',
    });
    expect(next).not.toHaveBeenCalled();
  });
});