import WebSocket from 'ws';
import { WsPayload } from '../websocket/dtos/ws-payload';
import { WsBroadcastFn } from '../websocket/middlewares/ws-broadcast.middleware';
import roomService, { RoomService } from '../rooms/services/room.service';
import { WsMessage } from '../websocket/dtos/ws-message';
import { WsErrorCode, WsException } from '../shared/errors/websocket';
import Logger from '../logger';
import chatService, { ChatService } from './services/chat.service';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import Deasyncify from 'deasyncify';
import parseAsyncObjectId from '../shared/utils/parse-async-objectid';
import { CHAT, SYNC } from '../websocket/events';

export class ChatWebsocketHandler {
  private readonly logger = new Logger(ChatWebsocketHandler.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
  ) {}

  public sendMessage = async (
    payload: WsPayload,
    ws: WebSocket,
    broadcast: WsBroadcastFn,
  ): Promise<void> => {
    const [, roomIdParsingErr] = await Deasyncify.watch(
      parseAsyncObjectId(payload.data.roomId),
    );

    const room =
      roomIdParsingErr == null
        ? await this.roomService.getRoomById(payload.data.roomId)
        : null;

    if (room == null) {
      this.logger.log('ROOM_NOT_FOUND');

      throw new WsException(
        WsErrorCode.BAD_USER_INPUT,
        'INVALID_ROOM_ID',
        true,
      );
    }

    const user = <User>(ws as any).user;

    if (user == null) {
      this.logger.log('USER_NOT_FOUND');

      throw new WsException(
        WsErrorCode.INTERNAL_SERVER_ERROR,
        'SOMETHING_WENT_WRONG',
        true,
      );
    }

    const USER_IS_PART_OF_ROOM = room.participants.some(
      (u) => u.id === user.id,
    );

    if (!USER_IS_PART_OF_ROOM) {
      this.logger.log('USER_NOT_PART_OF_ROOM');

      throw new WsException(
        WsErrorCode.BAD_USER_INPUT,
        'USER_NOT_IN_ROOM',
        true,
      );
    }

    let sentMsg = await this.chatService.addMsgToRoomChat({
      text: payload.data.message,
      roomId: room.id,
      senderId: user.id,
    });

    // broadcast user's message to others in room
    const msgToOthers = new WsMessage<Omit<Message, 'roomId' | 'delivered'>>({
      data: {
        id: sentMsg.id,
        text: sentMsg.text,
        sender: sentMsg.sender,
        sentAt: sentMsg.sentAt,
      },
      event: CHAT,
    }).stringify();

    this.logger.log('BROADCASTING_MESSAGE');

    broadcast(msgToOthers, {
      includeSelf: false,
      shouldBroadcastOnlyIf: (client) => {
        const userId = <string>(client as any).user?.id;
        if (user?.id === user.id) return false;
        return room.participants.some((r) => r.id === userId);
      },
      afterBroadcast: async () => {
        sentMsg = await this.chatService.updateDeliveredStatus(
          sentMsg.id,
          true,
        );
      },
    });

    // broadcast user's message to self
    const msgToSelf = new WsMessage<Omit<Message, 'roomId'>>({
      event: CHAT,
      data: {
        id: sentMsg.id,
        text: sentMsg.text,
        sender: sentMsg.sender,
        sentAt: sentMsg.sentAt,
        delivered: sentMsg.delivered,
      },
    }).stringify();

    broadcast(msgToSelf, {
      includeSelf: true,
      shouldBroadcastOnlyIf: (client) => {
        const userId = <string>(client as any).user?.id;
        if (user?.id !== user.id) return false;
        return room.participants.some((r) => r.id === userId);
      },
    });
  };

  public syncMessages = async (
    payload: WsPayload,
    ws: WebSocket,
    _broadcast: WsBroadcastFn,
  ): Promise<void> => {
    const [, roomIdParsingErr] = await Deasyncify.watch(
      parseAsyncObjectId(payload.data.roomId),
    );

    const room =
      roomIdParsingErr == null
        ? await this.roomService.getRoomById(payload.data.roomId)
        : null;

    if (room == null) {
      this.logger.log('ROOM_NOT_FOUND');

      throw new WsException(
        WsErrorCode.BAD_USER_INPUT,
        'INVALID_ROOM_ID',
        true,
      );
    }

    const user = <User>(ws as any).user;

    if (user == null) {
      this.logger.log('USER_NOT_FOUND');

      throw new WsException(
        WsErrorCode.INTERNAL_SERVER_ERROR,
        'SOMETHING_WENT_WRONG',
        true,
      );
    }

    const USER_IS_PART_OF_ROOM = room.participants.some(
      (u) => u.id === user.id,
    );

    if (!USER_IS_PART_OF_ROOM) {
      this.logger.log('USER_NOT_PART_OF_ROOM');

      throw new WsException(
        WsErrorCode.BAD_USER_INPUT,
        'USER_NOT_IN_ROOM',
        true,
      );
    }

    const roomChats = await this.chatService.getAllRoomChat(room.id);

    const msg = new WsMessage<Partial<Message>[]>({
      data: roomChats,
      event: SYNC,
    }).stringify();

    ws.send(msg);
  };
}

const chatWebsocketHandler = new ChatWebsocketHandler(chatService, roomService);

export default chatWebsocketHandler;
