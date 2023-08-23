import WebSocket from 'ws';
import roomService, { RoomService } from './services/room.service';
import { WsPayload } from '../websocket/dtos/ws-payload';
import { WsMessage } from '../websocket/dtos/ws-message';
import { WsErrorCode } from '../shared/errors/websocket';
import { WsBroadcastFn } from '../websocket/middlewares/ws-broadcast.middleware';
import userService, { UserService } from '../users/services/user.service';
import Logger from '../logger';
import chatService, { ChatService } from '../chat/services/chat.service';
import { Message } from '../chat/entities/message.entity';

export class RoomWebsocketHandler {
  private readonly logger = new Logger(RoomWebsocketHandler.name);
  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) {}

  public joinRoom = async (
    payload: WsPayload,
    ws: WebSocket,
    broadcast: WsBroadcastFn,
  ): Promise<void> => {
    const room = await this.roomService.getRoomById(payload.data.roomId);

    if (room == null) {
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

    const user = await this.userService.getUserById((ws as any).user?.id);

    if (user == null) {
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

    let ALREADY_PART_OF_ROOM = false;

    for (const participant of room.participants) {
      if (participant.id === user.id) {
        ALREADY_PART_OF_ROOM = true;
        break;
      }
    }

    if (ALREADY_PART_OF_ROOM) {
      this.logger.log('USER_ALREADY_PART_OF_ROOM');

      const msg = new WsMessage({
        status: 'error',
        error: {
          code: WsErrorCode.CONFLICT,
          message: 'ALREADY_PART_OF_ROOM',
        },
      }).stringify();

      ws.send(msg);

      return;
    }

    const updatedRoom = await this.roomService.joinRoom({
      roomId: room.id,
      userId: user.id,
    });

    this.logger.log('NEW_PARTICIPANT_JOINED_GROUP');

    const msg = new WsMessage<any>({
      data: { message: `${user.username} has joined` },
      event: payload.event,
    }).stringify();

    this.logger.log('BROADCASTING_TO_ROOM_MEMBERS');

    const roomChats = await this.chatService.getAllRoomChat(room.id);

    for (const messages of roomChats) {
      const msg = new WsMessage<Message>({
        data: messages,
        event: payload.event,
      }).stringify();

      ws.send(msg);
    }

    broadcast(msg, {
      shouldBroadcastOnlyIf: (client) => {
        const userId = <string>(client as any).user?.id;

        let IS_PART_OF_ROOM = false;

        for (const participant of updatedRoom.participants) {
          if (participant.id === userId) {
            IS_PART_OF_ROOM = true;
            break;
          }
        }

        return IS_PART_OF_ROOM;
      },
    });
  };
}

const roomWebsocketHandler = new RoomWebsocketHandler(
  chatService,
  roomService,
  userService,
);

export default roomWebsocketHandler;
