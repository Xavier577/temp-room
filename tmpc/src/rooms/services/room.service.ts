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
  constructor(private readonly roomRepository: RoomRepository) {}

  public async create(
    data: CreateRoomData,
  ): Promise<Omit<Room, 'participants'>> {
    return this.roomRepository.create(data);
  }

  public async joinRoom(args: JoinRoomARgs): Promise<Room> {
    return this.roomRepository.addParticipant(args.roomId, [args.userId]);
  }

  public async getRoomById(id: string): Promise<Room> {
    return this.roomRepository.findById(id);
  }

  public async getAllRooms(): Promise<Room[]> {
    return this.roomRepository.findAll();
  }

  public async getRoomsUserIsIn(userId: string): Promise<Room[]> {
    return this.roomRepository.findAllParticipating(userId);
  }
}

const roomService = new RoomService(roomRepository);

export default roomService;
