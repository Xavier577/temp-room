import { UnAuthorizedException } from '../errors';
import { NextFunction, Request, Response } from 'express';

export default function AuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const sessionUser = (req?.session as any)['account'] as { id: string };

  if (sessionUser == null) {
    throw new UnAuthorizedException();
  }

  next();
}
