import Logger from '../../logger';
import { WebSocket, WebSocketServer } from 'ws';
import http from 'http';
import { WsAuthMiddleware } from '../middlewares/ws-auth.middleware';
import { handleWsError } from './handle-ws-error';
import { handleWsClose } from './handle-ws-close';
import { handleWsMessage } from './handle-ws-message';

export type WsConnectEventHandler = (
  ws: WebSocket,
  request: http.IncomingMessage,
) => void;

export function handleWsConnect(
  wsServer: WebSocketServer,
): WsConnectEventHandler {
  const logger = new Logger('WS_CONNECTION_HANDLER');

  return (ws, request) => {
    logger.log('CONNECTION_ESTABLISHED');

    ws.on('error', handleWsError(ws));

    ws.on('close', handleWsClose);

    logger.log('AUTHENTICATING_CONNECTION');

    WsAuthMiddleware(ws, request).catch((e) => {
      ws.emit('error', e);
    });

    ws.on('message', handleWsMessage(ws, wsServer));
  };
}
