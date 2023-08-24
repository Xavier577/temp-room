import { UnAuthorizedException } from '../errors/http';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../logger';
import userService from '../../users/services/user.service';
import tokenService from '../services/token/token.service';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import Deasyncify from 'deasyncify';

export default async function AuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const logger = new Logger(AuthMiddleware.name);

  logger.log('AUTHENTICATING_REQUEST');

  const authorizationHeader = String(req.headers['authorization']);

  const token = authorizationHeader?.split?.(' ')?.[1];

  if (token == null) {
    throw new UnAuthorizedException();
  }

  const [decodedPayload, err] = await Deasyncify.watch(
    tokenService.verifyAsync<jwt.JwtPayload>(token),
  );

  if (err != null) {
    switch (true) {
      case err instanceof TokenExpiredError:
        throw new UnAuthorizedException('TOKEN_EXPIRED');
      case err instanceof JsonWebTokenError:
        throw new UnAuthorizedException('INVALID_TOKEN');
      default:
        throw err;
    }
  }

  const user = await userService.getUserById(String(decodedPayload?.id));

  if (user == null) {
    throw new UnAuthorizedException();
  }

  // append user to request
  (req as any).user = user;

  logger.log('AUTHENTICATED');

  next();
}
