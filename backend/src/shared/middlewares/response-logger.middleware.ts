import { NextFunction, Request, Response } from 'express';
import Logger from '../../config/logger';
import requestParser from '../utils/req-logger-parser';

export default function ResponseLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const logger = new Logger(ResponseLoggerMiddleware.name);

  const oldWrite = res.write,
    oldEnd = res.end;

  const chunks: any = [];

  res.write = function (chunk) {
    chunks.push(chunk);

    // eslint-disable-next-line prefer-rest-params
    return oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) chunks.push(chunk);

    const responseBody = Buffer.concat(
      chunks.map((x: any) =>
        typeof x === 'string' ? Buffer.from(x, 'binary') : x,
      ),
    ).toString('utf8');

    const requestInfo = requestParser(req);

    logger.log(
      JSON.stringify({
        requestInfo,
        responseInfo: { statusCode: res.statusCode, body: responseBody },
      }),
    );

    // eslint-disable-next-line prefer-rest-params
    oldEnd.apply(res, arguments);

    return res;
  };

  next();
}
