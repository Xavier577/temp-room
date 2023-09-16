import WebSocket from 'ws';
import roomService, { RoomService } from './services/room.service';
import { WsPayload } from '../websocket/dtos/ws-payload';
import { WsMessage } from '../websocket/dtos/ws-message';
import { WsErrorCode, WsException } from '../shared/errors/websocket';
import { WsBroadcastFn } from '../websocket/middlewares/ws-broadcast.middleware';
import Logger from '../logger';
import chatService, { ChatService } from '../chat/services/chat.service';
import { Message } from '../chat/entities/message.entity';
import { User } from '../users/entities/user.entity';
import Deasyncify from 'deasyncify';
import parseAsyncObjectId from '../shared/utils/parse-async-objectid';

export class RoomWebsocketHandler {
  private readonly logger = new Logger(RoomWebsocketHandler.name);
  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
  ) {}

  public joinRoom = async (
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

    let ALREADY_PART_OF_ROOM = false;

    for (const participant of room.participants) {
      if (participant.id === user.id) {
        ALREADY_PART_OF_ROOM = true;
        break;
      }
    }

    if (ALREADY_PART_OF_ROOM) {
      this.logger.log('USER_ALREADY_PART_OF_ROOM');

      throw new WsException(
        WsErrorCode.CONFLICT,
        'ALREADY_PART_OF_ROOM',
        false,
      );
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

const roomWebsocketHandler = new RoomWebsocketHandler(chatService, roomService);

export default roomWebsocketHandler;
