import messageRepository, {
  CreateMessageData,
  MessageRepository,
} from '../repositories/message.repository';
import { Message } from '../entities/message.entity';

export class ChatService {
  constructor(private readonly msgRepository: MessageRepository) {}

  public async getAllRoomChat(roomId: string): Promise<Message[]> {
    return this.msgRepository.findRoomMessages(roomId);
  }

  public async addMsgToRoomChat(msg: CreateMessageData): Promise<Message> {
    return this.msgRepository.create(msg);
  }

  public async updateDeliveredStatus(msgId: string, status: boolean) {
    return this.msgRepository.update(msgId, { delivered: status });
  }
}

const chatService = new ChatService(messageRepository);

export default chatService;
