import { Router } from 'express';
import roomController from './controller';
import {
  WatchAsyncController,
  WatchAsyncMiddleware,
} from '../shared/utils/watch-async-controller';
import AuthMiddleware from '../shared/middlewares/auth.middleware';
import { RequestBodyValidatorMiddleware } from '../shared/middlewares/request-body-validator.middleware';
import { createRoomValidatorSchema } from './validators/create-room.validator';

const roomRouter = Router();

roomRouter.post(
  '/',
  WatchAsyncMiddleware(AuthMiddleware),
  RequestBodyValidatorMiddleware(createRoomValidatorSchema),
  WatchAsyncController(roomController.createRoom),
);
roomRouter.get('/all', WatchAsyncController(roomController.getAllRooms));
roomRouter.get(
  '/participating',
  WatchAsyncMiddleware(AuthMiddleware),
  WatchAsyncController(roomController.getRoomsUserIsIn),
);
roomRouter.get('/:id', WatchAsyncController(roomController.getRoomById));

export default roomRouter;
