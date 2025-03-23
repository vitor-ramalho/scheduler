import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
    organizationId: string | null;
    refreshToken?: string;
    [key: string]: any;
  };
} 