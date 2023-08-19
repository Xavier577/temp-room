import roomService, { RoomService } from './services/room.service';
import { Request, Response } from 'express';

export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  public createRoom = (req: Request, res: Response) => {
    const data = req.body;

    const room = this.roomService.create({
      name: data.name,
      description: data.description,
    });

    res.status(200).json(room);
  };

  public getAllRooms = (_req: Request, res: Response) => {
    const rooms = this.roomService.getAllRooms();

    res.status(200).json(rooms);
  };

  public getRoomById = (req: Request, res: Response) => {
    const id = req.params.id;

    const room = this.roomService.get(id);

    res.status(200).json(room);
  };
}

const roomController = new RoomController(roomService);

export default roomController;
