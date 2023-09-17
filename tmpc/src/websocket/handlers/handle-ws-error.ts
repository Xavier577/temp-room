import { WebSocket } from 'ws';
import Logger from '../../logger';
import { WsErrorCode, WsException } from '../../shared/errors/websocket';
import { WsMessage } from '../dtos/ws-message';

export type WsErrorEventHandler = (e: Error) => void;

export function handleWsError(ws: WebSocket): WsErrorEventHandler {
  const logger = new Logger('WS_ERROR_HANDLER');

  return (e) => {
    logger.error(e);

    if (e instanceof WsException) {
      const data = new WsMessage({
        event: 'error',
        status: 'error',
        error: { code: e.code, message: e.message },
      }).stringify();
      ws.send(data);

      if (e.shouldCloseSocket) {
        ws.close();
      }

      return;
    }

    const data = new WsMessage({
      event: 'error',
      status: 'error',
      error: {
        code: WsErrorCode.INTERNAL_SERVER_ERROR,
        message: 'INTERNAL SERVER ERROR',
      },
    }).stringify();

    ws.send(data);

    ws.close();
  };
}
