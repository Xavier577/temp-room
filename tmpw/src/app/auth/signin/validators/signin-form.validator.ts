import Joi from 'joi';
import { SignInMode } from '@app/enums/sigin-mode';

export const signFormValidator = Joi.object({
  mode: Joi.string()
    .valid(SignInMode.EMAIL, SignInMode.USERNAME)
    .default(SignInMode.USERNAME),

  identifier: Joi.string().when('mode', {
    is: Joi.string().equal(SignInMode.EMAIL),
    then: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label('Please enter a valid email'),
    otherwise: Joi.string()
      .pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
      .required()
      .label('Please enter a valid username'),
  }),

  password: Joi.string().required(),
}).unknown();
