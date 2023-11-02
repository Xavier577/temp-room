import MessageModel, { Message as MMessage } from '../../mongo/schemas/message';
import { Message } from '../entities/message.entity';
import mongoose from 'mongoose';
import { CreateNullClass } from '../../shared/utils/null-class';
export interface CreateMessageData
  extends Partial<Omit<Message, 'id' | 'sender'>> {
  text: string;
  senderId: string;
  roomId: string;
}

export type UpdateMessageData = Partial<Pick<Message, 'text' | 'delivered'>>;

export interface MessageRepository {
  create(data: CreateMessageData): Promise<Message>;
  findById(id: string): Promise<Message>;
  findRoomMessages(roomId: string): Promise<Message[]>;
  deleteRoomMessages(roomId: string): Promise<void>;
  update(id: string, data: UpdateMessageData): Promise<Message>;
}

export class MessageRepositoryImpl implements MessageRepository {
  constructor(private readonly messageModel: mongoose.Model<MMessage>) {}

  public async create(data: CreateMessageData): Promise<Message> {
    const m = await this.messageModel.create({
      text: data.text,
      sender: data.senderId,
      room: data.roomId,
      sentAt: data.sentAt,
      delivered: data.delivered,
    });

    const msg = await this.messageModel.findById(m.id).populate('sender');

    return new Message({
      id: msg!._id.toString(),
      text: msg!.text,
      sender: {
        id: (msg!.sender as any)._id.toString(),
        username: (msg!.sender as any).username,
      },
      roomId: msg!.room.toString(),
      sentAt: msg!.sentAt,
      delivered: msg!.delivered,
    });
  }

  public async findById(id: string): Promise<Message> {
    const msg = await this.messageModel.findById(id).populate('sender');

    if (msg == null) {
      return CreateNullClass();
    }

    return new Message({
      id: msg._id.toString(),
      text: msg.text,
      sender: {
        id: (msg.sender as any)?._id.toString(),
        username: (msg.sender as any).username,
      },
      roomId: msg.room.toString(),
      sentAt: msg.sentAt,
      delivered: msg.delivered,
    });
  }

  async update(id: string, data: UpdateMessageData): Promise<Message> {
    const updateQuery: mongoose.UpdateQuery<MMessage> = {};

    if (data.text != null) {
      updateQuery.$set = { text: data.text };
    }

    if (data.delivered != null) {
      updateQuery.$set = { ...updateQuery, delivered: data.delivered };
    }

    const msg = await this.messageModel
      .findByIdAndUpdate(id, updateQuery, {
        new: true,
      })
      .populate('sender');

    if (msg == null) {
      return CreateNullClass();
    }

    return new Message({
      id: msg._id.toString(),
      text: msg.text,
      sender: {
        id: (msg.sender as any)._id.toString(),
        username: (msg.sender as any).username,
      },
      roomId: msg.room.toString(),
      sentAt: msg.sentAt,
      delivered: msg.delivered,
    });
  }

  public async findRoomMessages(roomId: string): Promise<Message[]> {
    const messages = await this.messageModel
      .find({ room: roomId })
      .populate('sender');

    return messages.map(
      (msg) =>
        new Message({
          id: msg._id.toString(),
          text: msg.text,
          sender: {
            id: (msg.sender as any)._id.toString(),
            username: (msg.sender as any).username,
          },
          roomId: msg.room.toString(),
          sentAt: msg.sentAt,
          delivered: msg.delivered,
        }),
    );
  }

  public async deleteRoomMessages(roomId: string): Promise<void> {
    await this.messageModel.deleteMany({ room: roomId });
  }
}

const messageRepository: MessageRepository = new MessageRepositoryImpl(
  MessageModel,
);

export default messageRepository;
