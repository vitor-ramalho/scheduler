import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { GetUser } from '../../src/common/decorators/get-user.decorator';

describe('GetUser Decorator', () => {
  it('should return the user object from the request', () => {
    const user = { id: 'user-id', email: 'test@example.com' };
    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    });

    const result = GetUser(null, mockContext);
    expect(result).toEqual(user);
  });

  it('should return undefined if no user object is present in the request', () => {
    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    });

    const result = GetUser(null, mockContext);
    expect(result).toBeUndefined();
  });
});