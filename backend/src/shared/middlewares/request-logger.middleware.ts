import { NextFunction, Request, Response } from 'express';
import Logger from '../../config/logger';
import requestParser from '../utils/req-logger-parser';

export default async function RequestLoggerMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const requestInfo = requestParser(req);

  const logger = new Logger(RequestLoggerMiddleware.name);

  logger.log(JSON.stringify(requestInfo));

  next();
}
