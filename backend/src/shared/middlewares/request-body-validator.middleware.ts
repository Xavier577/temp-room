import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Logger from '../../config/logger';
import { BadException } from '../errors';
export const RequestBodyValidatorMiddleware =
  <T>(validationSchema: Joi.ObjectSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const logger = new Logger(RequestBodyValidatorMiddleware.name);

    const validationResult = validationSchema.validate(req.body);

    if (validationResult.error != null) {
      logger.log(validationResult.error);
      throw new BadException(validationResult.error.message);
    }

    next();
  };
