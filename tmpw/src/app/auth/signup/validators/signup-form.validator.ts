import Joi from 'joi';

export const signupFormValidator = Joi.object({
  email: Joi.string().email().required(),

  username: Joi.string()
    .pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
    .required(),

  firstName: Joi.string().optional(),

  lastName: Joi.string().optional(),

  password: Joi.string().min(8).required(),

  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .label('password must match'),
}).unknown();
