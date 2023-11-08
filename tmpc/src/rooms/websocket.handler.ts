import WebSocket from 'ws';
import roomService, { RoomService } from './services/room.service';
import { WsPayload } from '../websocket/dtos/ws-payload';
import { WsMessage } from '../websocket/dtos/ws-message';
import { WsErrorCode, WsException } from '../shared/errors/websocket';
import { WsBroadcastFn } from '../websocket/middlewares/ws-broadcast.middleware';
import Logger from '../logger';
import { User } from '../users/entities/user.entity';
import Deasyncify from 'deasyncify';
import parseAsyncObjectId from '../shared/utils/parse-async-objectid';
import { Duration } from '../shared/enums';
import {
  END_ROOM,
  JOIN_ROOM,
  LEAVE_ROOM,
  REMOVE_PARTICIPANT,
} from '../websocket/events';

export class RoomWebsocketHandler {
  private readonly logger = new Logger(RoomWebsocketHandler.name);
  constructor(private readonly roomService: RoomService) {}

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

    const msgToSelf = new WsMessage<any>({
      data: { message: `you joined ${room.name}`, roomUpdate: updatedRoom },
      event: JOIN_ROOM,
    }).stringify();

    this.logger.log('BROADCASTING_TO_SELF');

    broadcast(msgToSelf, {
      includeSelf: true,
      shouldBroadcastOnlyIf: (client) => {
        const userId = <string>(client as any).user?.id;

        if (userId !== user.id) return false;

        return updatedRoom.participants.some((r) => r.id === user.id);
      },
      afterBroadcast: () => {
        this.logger.log('BROADCASTING_TO_ROOM_MEMBERS');

        const msgToOthers = new WsMessage<any>({
          data: {
            message: `${user.username} joined`,
            roomUpdate: updatedRoom,
          },
          event: JOIN_ROOM,
        }).stringify();

        broadcast(msgToOthers, {
          includeSelf: false,
          shouldBroadcastOnlyIf: (client) => {
            const userId = <string>(client as any).user?.id;

            if (userId === user.id) return false;

            return updatedRoom.participants.some((r) => r.id === userId);
          },
        });
      },
    });
  };

  public leaveRoom = async (
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

    await this.roomService.leaveRoom({ userId: user.id, roomId: room.id });

    const msgToAlertSelf = new WsMessage({
      event: LEAVE_ROOM,
      data: { message: `you left ${room.name}` },
    }).stringify();

    const msgToAlertOthers = new WsMessage({
      event: LEAVE_ROOM,
      data: { message: `${user.username} left ${room.name}` },
    }).stringify();

    broadcast(msgToAlertSelf, {
      includeSelf: true,
      shouldBroadcastOnlyIf: (client) => {
        const userId = <string>(client as any).user?.id;

        const IS_LEAVING_PARTICIPANT = user.id === userId;

        if (IS_LEAVING_PARTICIPANT) {
          // close participants connection after 3 seconds
          setTimeout(() => {
            if (client.readyState === WebSocket.OPEN) client.close();
          }, 3 * Duration.SECOND);
        }

        return IS_LEAVING_PARTICIPANT;
      },
    });

    broadcast(msgToAlertOthers, {
      includeSelf: false,
      shouldBroadcastOnlyIf: (client) => {
        const userId = <string>(client as any).user?.id;
        const MUST_NOT_BE_CURRENT_USER = user.id !== userId;
        return room.participants.some(
          (r) => r.id === userId && MUST_NOT_BE_CURRENT_USER,
        );
      },
    });
  };

  public removeParticipant = async (
    payload: WsPayload<{ roomId: string; participantsId: string }>,
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

    const USER_IS_HOST = room.hostId === user.id;

    if (!USER_IS_HOST) {
      this.logger.log('USER_NOT_HOST');

      throw new WsException(
        WsErrorCode.BAD_USER_INPUT,
        'ONLY_HOST_CAN_END_ROOM',
      );
    }

    const participant = room.participants.find(
      (participant) => participant.id === payload.data.participantsId,
    );

    if (participant == null) {
      this.logger.log('PARTICIPANT_IS_NOT_IN_ROOM');

      throw new WsException(
        WsErrorCode.CONFLICT,
        'NO_PARTICIPANT_WITH_SUCH_ID',
      );
    }

    await this.roomService.leaveRoom({
      userId: participant.id,
      roomId: room.id,
    });

    const msgToAlertHost = new WsMessage({
      event: REMOVE_PARTICIPANT,
      data: { message: `you removed ${user.username}` },
    }).stringify();

    const msgToAlertRemovedParticipant = new WsMessage({
      event: REMOVE_PARTICIPANT,
      data: {
        id: participant.id,
        message: `${user.username} removed you`,
      },
    }).stringify();

    const msgToAlertOthers = new WsMessage({
      event: REMOVE_PARTICIPANT,
      data: { message: `${user.username} removed ${participant.username}` },
    }).stringify();

    broadcast(msgToAlertHost, {
      includeSelf: true,
      shouldBroadcastOnlyIf: (client) => {
        const userId = <string>(client as any).user?.id;
        return room.hostId === userId;
      },
    });

    broadcast(msgToAlertRemovedParticipant, {
      includeSelf: false,
      shouldBroadcastOnlyIf: (client) => {
        const userId = <string>(client as any).user?.id;
        const IS_REMOVED_PARTICIPANT = participant.id === userId;

        if (IS_REMOVED_PARTICIPANT) {
          // close participant's connection after 3 seconds
          setTimeout(() => {
            if (client.readyState === WebSocket.OPEN) client.close();
          }, 3 * Duration.SECOND);
        }

        return IS_REMOVED_PARTICIPANT;
      },
    });

    broadcast(msgToAlertOthers, {
      includeSelf: false,
      shouldBroadcastOnlyIf: (client) => {
        const userId = <string>(client as any).user?.id;

        const IS_NOT_REMOVED_PARTICIPANT = participant.id != userId;

        const IS_NOT_HOST = room.hostId != userId;

        return room.participants.some(
          (r) => r.id === userId && IS_NOT_HOST && IS_NOT_REMOVED_PARTICIPANT,
        );
      },
    });
  };

  public endRoom = async (
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

    const USER_IS_HOST = room.hostId === user.id;

    if (!USER_IS_HOST) {
      this.logger.log('USER_NOT_HOST');

      throw new WsException(
        WsErrorCode.BAD_USER_INPUT,
        'ONLY_HOST_CAN_END_ROOM',
      );
    }

    const msg = new WsMessage({
      event: END_ROOM,
      data: { message: `${user.username} has ended the room` },
    }).stringify();

    broadcast(msg, {
      includeSelf: false,
      shouldBroadcastOnlyIf: (client) => {
        const userId = <string>(client as any).user?.id;

        const IS_PARTICIPANT = room.participants.some((r) => r.id === userId);

        if (IS_PARTICIPANT) {
          // close participants connection after 3 seconds
          setTimeout(() => {
            if (client.readyState === WebSocket.OPEN) client.close();
          }, 3 * Duration.SECOND);
        }

        return IS_PARTICIPANT;
      },
      afterBroadcast: async () => {
        await this.roomService.endRoom(room.id);
      },
    });
  };
}

const roomWebsocketHandler = new RoomWebsocketHandler(roomService);

export default roomWebsocketHandler;
