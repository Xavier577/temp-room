import { Request, Response, NextFunction } from 'express';
import { ExpressController } from '../types';

export const WatchAsyncController =
  (fn: ExpressController) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res)).catch(next);
