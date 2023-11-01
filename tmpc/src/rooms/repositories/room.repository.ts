import mongoose from 'mongoose';
import RoomModel, { Room as MRoom } from '../../mongo/schemas/room';
import { Room } from '../entities/room.entity';
import { CreateNullClass } from '../../shared/utils/null-class';

export interface CreateRoomData
  extends Partial<Omit<Room, 'id' | 'participants'>> {
  name: string;
  hostId: string;
}

export type UpdateRoomData = Partial<Pick<Room, 'name' | 'description'>>;

export interface RoomRepository {
  create(data: CreateRoomData): Promise<Omit<Room, 'participants'>>;
  findAll(): Promise<Room[]>;
  findAllParticipating(userId: string): Promise<Room[]>;
  findById(id: string): Promise<Room>;
  findByHostId(hostId: string): Promise<Room>;
  update(id: string, data: UpdateRoomData): Promise<Room>;
  addParticipant(id: string, participants: string[]): Promise<Room>;
  removeParticipant(id: string, participants: string[]): Promise<Room>;
  deleteRoom(id: string): Promise<void>;
}

export class RoomRepositoryImpl implements RoomRepository {
  constructor(private readonly roomModel: mongoose.Model<MRoom>) {}

  public async findAll(): Promise<Room[]> {
    const rooms = await this.roomModel.find().populate('participants');

    return rooms.map(
      (room) =>
        new Room({
          id: room._id.toString(),
          name: room.name,
          description: room.description,
          hostId: room.host.toString(),
          participants: room.participants?.map?.((p) => ({
            id: <string>(p as any)._id?.toString?.(),
            username: <string>(p as any)?.username,
          })),
        }),
    );
  }

  public async findAllParticipating(userId: string): Promise<Room[]> {
    const rooms = await this.roomModel
      .find({ participants: userId })
      .populate('participants');

    return rooms.map(
      (room) =>
        new Room({
          id: room._id.toString(),
          name: room.name,
          description: room.description,
          hostId: room.host.toString(),
          participants: room.participants?.map?.((p) => ({
            id: <string>(p as any)._id?.toString?.(),
            username: <string>(p as any)?.username,
          })),
        }),
    );
  }

  public async create(
    data: CreateRoomData,
  ): Promise<Omit<Room, 'participants'>> {
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
    });
  }

  public async findById(id: string): Promise<Room> {
    const room = await this.roomModel.findById(id).populate('participants');

    if (room == null) {
      return CreateNullClass();
    }

    return new Room({
      id: room._id.toString(),
      name: room.name,
      description: room.description,
      hostId: room.host.toString(),
      participants: room.participants?.map?.((p) => ({
        id: <string>(p as any)._id?.toString?.(),
        username: <string>(p as any).username,
      })),
    });
  }

  public async findByHostId(hostId: string): Promise<Room> {
    const room = await this.roomModel
      .findOne({ host: hostId })
      .populate('participants');

    if (room == null) {
      return CreateNullClass();
    }

    return new Room({
      id: room._id.toString(),
      name: room.name,
      description: room.description,
      hostId: room.host.toString(),
      participants: room.participants?.map?.((p) => ({
        id: <string>(p as any)._id?.toString?.(),
        username: <string>(p as any).username,
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

    const room = await this.roomModel
      .findByIdAndUpdate(id, updateQuery, {
        new: true,
      })
      .populate('participants');

    if (room == null) {
      return CreateNullClass();
    }

    return new Room({
      id: room._id.toString(),
      name: room.name,
      description: room.description,
      hostId: room.host.toString(),
      participants: room.participants?.map?.((p) => ({
        id: <string>(p as any)._id?.toString?.(),
        username: <string>(p as any).username,
      })),
    });
  }

  public async addParticipant(
    id: string,
    participant: string[],
  ): Promise<Room> {
    const room = await this.roomModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            participants: participant,
          },
        },
        { new: true },
      )
      .populate('participants');

    if (room == null) {
      return CreateNullClass();
    }

    return new Room({
      id: room._id.toString(),
      name: room.name,
      description: room.description,
      hostId: room.host.toString(),
      participants: room.participants?.map?.((p) => ({
        id: <string>(p as any)._id?.toString?.(),
        username: <string>(p as any).username,
      })),
    });
  }

  public async removeParticipant(
    id: string,
    participants: string[],
  ): Promise<Room> {
    const room = await this.roomModel
      .findByIdAndUpdate(
        id,
        {
          $pull: {
            participants: participants,
          },
        },
        { new: true },
      )
      .populate('participants');

    if (room == null) {
      return CreateNullClass();
    }

    return new Room({
      id: room._id.toString(),
      name: room.name,
      description: room.description,
      hostId: room.host.toString(),
      participants: room.participants?.map?.((p) => ({
        id: <string>(p as any)._id?.toString?.(),
        username: <string>(p as any).username,
      })),
    });
  }

  public async deleteRoom(id: string): Promise<void> {
    await this.roomModel.findByIdAndDelete(id);
  }
}

const roomRepository: RoomRepository = new RoomRepositoryImpl(RoomModel);

export default roomRepository;
