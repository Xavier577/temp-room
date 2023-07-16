import { Router } from 'express';
import userRouter from './users/routes';

export const v1Router = Router();

v1Router.use('/user', userRouter);
