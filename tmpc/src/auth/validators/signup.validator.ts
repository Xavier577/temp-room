import Joi from 'joi';

export const signupPayloadValidatorSchema = Joi.object({
  email: Joi.string().email().required(),

  username: Joi.string()
    .pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
    .required(),

  firstName: Joi.string().allow('').optional(),

  lastName: Joi.string().allow('').optional(),

  password: Joi.string().required(),
}).unknown();
