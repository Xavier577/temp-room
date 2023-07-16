import { NextFunction, Request, Response } from 'express';
import Logger from '../../config/logger';
import { HttpException } from '../errors';

export function GlobalErrorCatcherMiddleware(
  err: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  Logger.error(err);

  const isHttpException = err instanceof HttpException;

  if (err?.code == null || !isHttpException) {
    res.status(500).send('Internal Server Error');
    return;
  }
  res.status(err.code).send(err.message);
}
