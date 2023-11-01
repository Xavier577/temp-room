import roomService, { RoomService } from './services/room.service';
import { Request, Response } from 'express';
import { User } from '../users/entities/user.entity';
import { CreateRoomDto } from './dtos/create-room.dto';
import parseAsyncObjectId from '../shared/utils/parse-async-objectid';
import Deasyncify from 'deasyncify';
import { BadException, NotFoundException } from '../shared/errors/http';

export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  public createRoom = async (req: Request, res: Response): Promise<void> => {
    const payload = new CreateRoomDto(req.body);

    const user = <User>(req as any).user;

    const room = await this.roomService.create({
      name: payload.name,
      description: payload.description || undefined,
      hostId: user.id,
    });

    res.status(200).json(room);
  };

  public getAllRooms = async (_req: Request, res: Response): Promise<void> => {
    const rooms = await this.roomService.getAllRooms();

    res.status(200).json(rooms);
  };

  public getRoomById = async (req: Request, res: Response): Promise<void> => {
    const [id, idParsingErr] = await Deasyncify.watch(
      parseAsyncObjectId(req.params.id),
    );

    if (idParsingErr != null) {
      throw new BadException('Invalid Room Id');
    }

    const room = await this.roomService.getRoomById(id!.toString());

    if (room == null) {
      throw new NotFoundException('Room Not Found');
    }

    res.status(200).json(room);
  };

  public getRoomsUserIsIn = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const user = (<Request & { user: User }>req).user;

    const rooms = await this.roomService.getRoomsUserIsIn(user.id);

    res.status(200).json(rooms);
  };
}

const roomController = new RoomController(roomService);

export default roomController;
