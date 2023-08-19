import roomService, { RoomService } from './services/room.service';
import WebSocket from 'ws';
import { WsPayload } from '../websocket/dtos/ws-payload';
import { WsMessage } from '../websocket/dtos/ws-message';

export class RoomWebsocketHandler {
  constructor(private readonly roomService: RoomService) {}

  public joinRoom = (payload: WsPayload, ws: WebSocket): void => {
    const room = this.roomService.get(payload.data.roomId);

    const res = new WsMessage<any>({
      data: { message: `you have joined room ${room.name}` },
      event: payload.event,
    }).stringify();

    ws.send(res);
  };
}

const roomWebsocketHandler = new RoomWebsocketHandler(roomService);

export default roomWebsocketHandler;
