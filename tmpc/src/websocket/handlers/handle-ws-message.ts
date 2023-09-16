import { RawData, WebSocket, WebSocketServer } from 'ws';
import Logger from '../../logger';
import { WsPayload } from '../dtos/ws-payload';
import { WsBroadcastMiddleware } from '../middlewares/ws-broadcast.middleware';
import roomWebsocketHandler from '../../rooms/websocket.handler';
import chatWebsocketHandler from '../../chat/websocket.handler';
import { WsMessage } from '../dtos/ws-message';
import { WsErrorCode, WsException } from '../../shared/errors/websocket';

export type WsMessageEventHandler = (
  message: RawData,
  isBinary: boolean,
) => void;

export function handleWsMessage(
  ws: WebSocket,
  wsServer: WebSocketServer,
): WsMessageEventHandler {
  const logger = new Logger('WS_MESSAGE_HANDLER');

  return (message, isBinary) => {
    logger.log('RECEIVED_MESSAGE');

    logger.log(message.toString());

    try {
      const parsedData = JSON.parse(message.toString());

      const payload = new WsPayload(parsedData);

      const broadcastFn = WsBroadcastMiddleware(ws, wsServer, isBinary);

      switch (payload.event) {
        case 'join_room':
          roomWebsocketHandler.joinRoom(payload, ws, broadcastFn).catch((e) => {
            ws.emit('error', e);
          });
          break;
        case 'chat':
          chatWebsocketHandler
            .sendMessage(payload, ws, broadcastFn)
            .catch((e) => ws.emit('error', e));
          break;
        case 'leave_room':
          // leave room
          break;
        default:
          const data = new WsMessage({
            status: 'error',
            error: {
              code: WsErrorCode.BAD_USER_INPUT,
              message: 'INVALID_EVENT_TYPE',
            },
          }).stringify();

          ws.send(data);
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        ws.emit(
          'error',
          new WsException(WsErrorCode.BAD_USER_INPUT, e.message),
        );
        return;
      }
      ws.emit('error', e);
    }
  };
}
