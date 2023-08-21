import WebSocket from 'ws';
import roomService, { RoomService } from './services/room.service';
import { WsPayload } from '../websocket/dtos/ws-payload';
import { WsMessage } from '../websocket/dtos/ws-message';
import { WsErrorCode } from '../shared/errors/websocket';
import { WsBroadcastFn } from '../websocket/middlewares/ws-board-cast.middleware';
import userService, { UserService } from '../users/services/user.service';
import Logger from '../logger';

export class RoomWebsocketHandler {
  private readonly logger = new Logger(RoomWebsocketHandler.name);
  constructor(
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  public joinRoom = (
    payload: WsPayload,
    ws: WebSocket,
    broadcast: WsBroadcastFn,
  ): void => {
    const room = this.roomService.get(payload.data.roomId);

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

    const user = this.userService.getUser(payload.data.userId);

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

    const updatedRoom = this.roomService.joinRoom(room.id, user.id);

    const msg = new WsMessage<any>({
      data: { message: `${user.username} has joined room ${room.name}` },
      event: payload.event,
    }).stringify();

    broadcast(msg, {
      shouldBroadCastOnlyIf: (client) => {
        const userId = <string>(client as any).userId;

        const IS_PART_OF_ROOM = updatedRoom.participants.some(
          (r) => r.id === userId,
        );

        this.logger.log(`user is in room ${IS_PART_OF_ROOM}`);

        return IS_PART_OF_ROOM;
      },
    });
  };
}

const roomWebsocketHandler = new RoomWebsocketHandler(userService, roomService);

export default roomWebsocketHandler;
