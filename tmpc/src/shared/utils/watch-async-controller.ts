import { Request, Response, NextFunction } from 'express';
import { ExpressController, ExpressMiddleware } from '../types';

export const WatchAsyncController =
  (fn: ExpressController) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const WatchAsyncMiddleware =
  (middleware: ExpressMiddleware) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(middleware(req, res, next)).catch(next);
