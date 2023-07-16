import Joi from 'joi';
import { AppEnv } from '../enums';

export interface EnvProps {
  PORT: number;
  NODE_ENV: string;
  MONGO_DATABASE_URL: string;
  SWAGGER_ROUTE: string;
}

export const envValidatorSchema = Joi.object<EnvProps>({
  PORT: Joi.number().default(8000),
  NODE_ENV: Joi.string()
    .valid(AppEnv.DEVELOPMENT, AppEnv.TEST, AppEnv.STAGING, AppEnv.PRODUCTION)
    .default(AppEnv.DEVELOPMENT),

  MONGO_DATABASE_URL: Joi.string().required(),

  SWAGGER_ROUTE: Joi.string().default('/api/docs'),
}).unknown(true);
