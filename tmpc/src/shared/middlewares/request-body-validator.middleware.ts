import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Logger from '../../logger';
import { BadException } from '../errors/http';
export const RequestBodyValidatorMiddleware =
  <T>(validationSchema: Joi.ObjectSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const logger = new Logger(RequestBodyValidatorMiddleware.name);

    const validationResult = validationSchema.validate(req.body);

    if (validationResult.error != null) {
      logger.log(validationResult.error);
      throw new BadException(JSON.stringify(validationResult.error.details));
    }

    next();
  };
