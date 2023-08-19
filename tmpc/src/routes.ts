import { Router } from 'express';
import userRouter from './users/routes';
import roomRouter from './rooms/routes';

export const v1Router = Router();

v1Router.use('/user', userRouter);
v1Router.use('/room', roomRouter);
