import Joi from 'joi';

export const signupPayloadValidatorSchema = Joi.object({
  email: Joi.string().email().required(),

  username: Joi.string().required(),

  firstName: Joi.string().optional(),

  lastName: Joi.string().optional(),

  password: Joi.string().required(),
}).unknown();
