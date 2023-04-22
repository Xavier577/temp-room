import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import requestParser from '@common/utils/request-logger.parser';

@Injectable()
export class RequestLogger implements NestMiddleware {
  private logger = new Logger(RequestLogger.name);

  public async use(req: Request, _res: Response, next: NextFunction) {
    const requestInfo = await requestParser(req);

    this.logger.log(JSON.stringify(requestInfo, null, 4));

    next();
  }
}
