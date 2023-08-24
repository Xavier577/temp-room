import Joi from 'joi';
import { LOGIN_MODE } from '../../shared/enums';

export const loginPayloadValidatorSchema = Joi.object({
  mode: Joi.string()
    .valid(LOGIN_MODE.EMAIL, LOGIN_MODE.USERNAME)
    .default(LOGIN_MODE.EMAIL),

  email: Joi.string()
    .email()
    .when('mode', {
      is: Joi.string().equal(LOGIN_MODE.EMAIL),
      then: Joi.string().required(),
      otherwise: Joi.string().optional(),
    }),

  username: Joi.string().when('mode', {
    is: Joi.string().equal(LOGIN_MODE.USERNAME),
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),

  password: Joi.string().required(),
}).unknown();
