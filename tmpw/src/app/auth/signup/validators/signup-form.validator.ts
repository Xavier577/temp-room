import Joi from 'joi';

export const signupFormValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label('please enter a valid email'),

  // Regular expression to match valid identifiers:
  // - The identifier must start with a letter (a-z or A-Z) or an underscore or number (if it starts with a number it must contain at least a letter).
  // - The rest of the identifier can contain letters, numbers, or underscores.
  username: Joi.string()
    .pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$/)
    .required()
    .label('username must contain at least a letter'),

  password: Joi.string()
    .min(6)
    .required()
    .label('password must contain at least 6 characters'),

  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .label('password must match'),

  firstName: Joi.string().allow('').optional(),

  lastName: Joi.string().allow('').optional(),
}).unknown();
