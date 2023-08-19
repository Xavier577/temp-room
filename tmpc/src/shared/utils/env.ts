import * as process from 'process';
import { configDotenv } from 'dotenv';
import Joi from 'joi';

configDotenv();

export default class Env {
  private static validatedEnv: any;

  public static async validateEnv<T>(validationSchema: Joi.ObjectSchema<T>) {
    try {
      this.validatedEnv = await validationSchema.validateAsync(process.env);
    } catch (e) {
      throw e;
    }
  }

  public static get<T = string>(key: string) {
    if (this.validatedEnv?.[key] != null) return this.validatedEnv[key] as T;
    return process.env[key] as T;
  }
}
