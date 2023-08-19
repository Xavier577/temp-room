import { Router } from 'express';
import roomController from './controller';

const roomRouter = Router();

roomRouter.post('/', roomController.createRoom);
roomRouter.get('/all', roomController.getAllRooms);
roomRouter.get('/:id', roomController.getRoomById);

export default roomRouter;
