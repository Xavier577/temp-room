import roomService, { RoomService } from './services/room.service';
import { Request, Response } from 'express';
import { User } from '../users/entities/user.entity';
import { CreateRoomDto } from './dtos/create-room.dto';
import { Types } from 'mongoose';

export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  public createRoom = async (req: Request, res: Response) => {
    const payload = new CreateRoomDto(req.body);

    const user = <User>(req as any).user;

    const room = await this.roomService.create({
      name: payload.name,
      description: payload.description,
      hostId: user.id,
    });

    res.status(200).json(room);
  };

  public getAllRooms = async (_req: Request, res: Response) => {
    const rooms = await this.roomService.getAllRooms();

    res.status(200).json(rooms);
  };

  public getRoomById = async (req: Request, res: Response) => {
    try {
      const id = new Types.ObjectId(req.params.id);

      const room = await this.roomService.getRoomById(id.toString());

      if (room == null) {
        res.status(404).json({ message: 'Room Not Found' });
      }

      res.status(200).json(room);
    } catch (error) {
      res.status(400).json({ message: 'Invalid User Id' });
    }
  };
}

const roomController = new RoomController(roomService);

export default roomController;
