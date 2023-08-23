import { Router } from 'express';
import { RequestBodyValidatorMiddleware } from '../shared/middlewares/request-body-validator.middleware';
import { loginPayloadValidatorSchema } from './validators/login.validator';
import authController from './controller';
import { WatchAsyncController } from '../shared/utils/watch-async-controller';

const authRouter = Router();

authRouter.post('/signup');

authRouter.post(
  '/login',
  RequestBodyValidatorMiddleware(loginPayloadValidatorSchema),
  WatchAsyncController(authController.login),
);

export default authRouter;
