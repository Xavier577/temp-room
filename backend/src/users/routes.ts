import { Router } from 'express';
import userController from './user.controller';
import { WatchAsyncController } from '../shared/utils/watch-async-controller';

const userRouter = Router();

userRouter.get('/', WatchAsyncController(userController.getUser));

export default userRouter;
