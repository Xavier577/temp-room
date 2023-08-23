import mongoose from 'mongoose';
import RoomModel, { Room as MRoom } from '../../mongo/schemas/room';
import { Room } from '../entities/room.entity';
import { CreateNullClass } from '../../shared/utils/null-class';

export interface CreateRoomData
  extends Partial<Omit<Room, 'id' | 'participants'>> {
  name: string;
  description: string;
  hostId: string;
}

export type UpdateRoomData = Partial<
  Pick<Room, 'name' | 'description' | 'participants'>
>;

export interface RoomRepository {
  create(data: CreateRoomData): Promise<Room>;
  findAll(): Promise<Room[]>;
  findById(id: string): Promise<Room>;
  findByHostId(hostId: string): Promise<Room>;
  update(id: string, data: UpdateRoomData): Promise<Room>;
}

export class RoomRepositoryImpl implements RoomRepository {
  constructor(private readonly roomModel: mongoose.Model<MRoom>) {}

  public async findAll(): Promise<Room[]> {
    const rooms = await this.roomModel.find();

    return rooms.map(
      (room) =>
        new Room({
          id: room._id.toString(),
          name: room.name,
          description: room.description,
          hostId: room.host.toString(),
          participants: room.participants?.map?.((p) => ({
            id: p.toString(),
          })),
        }),
    );
  }

  public async create(data: CreateRoomData): Promise<Room> {
    const room = await this.roomModel.create({
      name: data.name,
      description: data.description,
      host: data.hostId,
      participants: [data.hostId],
    });

    return new Room({
      id: room._id.toString(),
      name: room.name,
      description: room.description,
      hostId: room.host.toString(),
      participants: room.participants?.map?.((p) => ({
        id: p.toString(),
      })),
    });
  }

  public async findById(id: string): Promise<Room> {
    const room = await this.roomModel.findById(id);

    if (room == null) {
      return CreateNullClass();
    }

    return new Room({
      id: room._id.toString(),
      name: room.name,
      description: room.description,
      hostId: room.host.toString(),
      participants: room.participants?.map?.((p) => ({
        id: p.toString(),
      })),
    });
  }

  public async findByHostId(hostId: string): Promise<Room> {
    const room = await this.roomModel.findOne({ host: hostId });

    if (room == null) {
      return CreateNullClass();
    }

    return new Room({
      id: room._id.toString(),
      name: room.name,
      description: room.description,
      hostId: room.host.toString(),
      participants: room.participants?.map?.((p) => ({
        id: p.toString(),
      })),
    });
  }

  public async update(id: string, data: UpdateRoomData): Promise<Room> {
    const updateQuery: mongoose.UpdateQuery<MRoom> = {};

    if (data.name != null) {
      updateQuery.name = data.name;
    }

    if (data.description != null) {
      updateQuery.description = data.description;
    }

    if (data.participants != null) {
      updateQuery.participants = {
        $push: { participants: { $each: data.participants.map((p) => p.id) } },
      };
    }

    const room = await this.roomModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    if (room == null) {
      return CreateNullClass();
    }

    return new Room({
      id: room._id.toString(),
      name: room.name,
      description: room.description,
      hostId: room.host.toString(),
      participants: room.participants?.map?.((p) => ({
        id: p.toString(),
      })),
    });
  }
}

const roomRepository: RoomRepository = new RoomRepositoryImpl(RoomModel);

export default roomRepository;
