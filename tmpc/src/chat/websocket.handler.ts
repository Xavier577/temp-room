import WebSocket from 'ws';
import { WsPayload } from '../websocket/dtos/ws-payload';
import { WsBroadcastFn } from '../websocket/middlewares/ws-broadcast.middleware';
import roomService, { RoomService } from '../rooms/services/room.service';
import userService, { UserService } from '../users/services/user.service';
import { WsMessage } from '../websocket/dtos/ws-message';
import { WsErrorCode } from '../shared/errors/websocket';
import Logger from '../logger';
import chatService, { ChatService } from './services/chat.service';
import { Message } from './entities/message.entity';

export class ChatWebsocketHandler {
  private readonly logger = new Logger(ChatWebsocketHandler.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}
  public sendMessage = async (
    payload: WsPayload,
    ws: WebSocket,
    broadcast: WsBroadcastFn,
  ): Promise<void> => {
    const room = await this.roomService.getRoomById(payload.data.roomId);

    if (room == null) {
      this.logger.log('ROOM_NOT_FOUND');

      const msg = new WsMessage({
        status: 'error',
        error: {
          code: WsErrorCode.BAD_USER_INPUT,
          message: 'INVALID_ROOM_ID',
        },
      }).stringify();

      ws.send(msg);

      ws.close();

      return;
    }

    const user = await this.userService.getUserById((ws as any)?.user.id);

    if (user == null) {
      this.logger.log('USER_NOT_FOUND');

      const msg = new WsMessage({
        status: 'error',
        error: {
          code: WsErrorCode.BAD_USER_INPUT,
          message: 'INVALID_USER_ID',
        },
      }).stringify();

      ws.send(msg);

      ws.close();

      return;
    }

    const USER_IS_PART_OF_ROOM = room.participants.some(
      (u) => u.id === user.id,
    );

    if (!USER_IS_PART_OF_ROOM) {
      this.logger.log('USER_NOT_PART_OF_ROOM');

      const msg = new WsMessage({
        status: 'error',
        error: {
          code: WsErrorCode.BAD_USER_INPUT,
          message: 'USER_NOT_IN_ROOM',
        },
      }).stringify();

      ws.send(msg);

      ws.close();

      return;
    }

    const savedMsg = await this.chatService.addMsgToRoomChat({
      text: payload.data.message,
      roomId: room.id,
      senderId: user.id,
    });

    // broadcast user's message
    const msg = new WsMessage<Omit<Message, 'roomId' | 'delivered'>>({
      data: {
        id: savedMsg.id,
        text: savedMsg.text,
        senderId: savedMsg.senderId,
        sentAt: savedMsg.sentAt,
      },
      event: payload.event,
    }).stringify();

    this.logger.log('BROADCASTING_MESSAGE');

    broadcast(msg, {
      includeSelf: false,
      shouldBroadcastOnlyIf: (client) => {
        const userId = <string>(client as any).userId;
        return room.participants.some((r) => r.id === userId);
      },
      afterBroadcast: async () => {
        await this.chatService.updateDeliveredStatus(savedMsg.id, true);
      },
    });
  };
}

const chatWebsocketHandler = new ChatWebsocketHandler(
  chatService,
  roomService,
  userService,
);

export default chatWebsocketHandler;
