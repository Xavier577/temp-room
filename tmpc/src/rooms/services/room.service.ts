import { Room } from '../entities/room.entity';
import roomRepository, {
  CreateRoomData,
  RoomRepository,
} from '../repositories/room.repository';

export interface JoinRoomARgs {
  roomId: string;
  userId: string;
}

export class RoomService {
  constructor(private readonly roomService: RoomRepository) {}

  public async create(data: CreateRoomData): Promise<Room> {
    return this.roomService.create(data);
  }

  public async joinRoom(args: JoinRoomARgs): Promise<Room> {
    return this.roomService.update(args.roomId, {
      participants: [{ id: args.userId }],
    });
  }

  public async getRoomById(id: string): Promise<Room> {
    return this.roomService.findById(id);
  }

  public async getAllRooms(): Promise<Room[]> {
    return this.roomService.findAll();
  }
}

const roomService = new RoomService(roomRepository);

export default roomService;
