import { Room } from '../entities/room.entity';
import roomRepository, {
  CreateRoomData,
  RoomRepository,
} from '../repositories/room.repository';

export interface JoinRoomArgs {
  roomId: string;
  userId: string;
}

export type LeaveRoomArgs = JoinRoomArgs;

export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  public async create(
    data: CreateRoomData,
  ): Promise<Omit<Room, 'participants'>> {
    return this.roomRepository.create(data);
  }

  public async joinRoom(args: JoinRoomArgs): Promise<Room> {
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

  public async leaveRoom(args: LeaveRoomArgs): Promise<Room> {
    return this.roomRepository.removeParticipant(args.roomId, [args.userId]);
  }

  public async endRoom(roomId: string): Promise<void> {
    return this.roomRepository.deleteRoom(roomId);
  }
}

const roomService = new RoomService(roomRepository);

export default roomService;
