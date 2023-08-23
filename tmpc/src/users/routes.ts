import { Router } from 'express';
import userController from './controller';
import {
  WatchAsyncController,
  WatchAsyncMiddleware,
} from '../shared/utils/watch-async-controller';
import AuthMiddleware from '../shared/middlewares/auth.middleware';

const userRouter = Router();

userRouter.get(
  '/',
  WatchAsyncMiddleware(AuthMiddleware),
  WatchAsyncController(userController.getUser),
);

export default userRouter;
