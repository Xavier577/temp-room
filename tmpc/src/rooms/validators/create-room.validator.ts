import Joi from 'joi';

export const createRoomValidatorSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
}).unknown();
