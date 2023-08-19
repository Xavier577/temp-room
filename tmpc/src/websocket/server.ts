import http from 'http';
import { WebSocketServer } from 'ws';
import { WsPayload } from './dtos/ws-payload';
import { WsMessage } from './dtos/ws-message';
import { WsErrorCode, WsException } from '../shared/errors/websocket';
import Logger from '../logger';
import * as https from 'https';
import roomWebsocketHandler from '../rooms/websocket.handler';

export function websocketServer(server: http.Server | https.Server) {
  const wsServer = new WebSocketServer({ noServer: true });

  const logger = new Logger(websocketServer.name);

  wsServer.on('connection', (ws) => {
    ws.on('message', (message) => {
      try {
        const parsedData = JSON.parse(message.toString());

        const payload = new WsPayload(parsedData);

        switch (payload.event) {
          case 'join_room':
            // join room
            roomWebsocketHandler.joinRoom(payload, ws);
            break;
          case 'chat':
            //chat
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
    });

    ws.on('error', (e) => {
      logger.error(e);

      if (e instanceof WsException) {
        const data = new WsMessage({
          status: 'error',
          error: { code: e.code, message: e.message },
        }).stringify();
        ws.send(data);
        return;
      }

      const data = new WsMessage({
        status: 'error',
        error: {
          code: WsErrorCode.INTERNAL_SERVER_ERROR,
          message: 'INTERNAL SERVER ERROR',
        },
      }).stringify();

      ws.send(data);
    });
  });

  server.on('upgrade', function upgrade(request, socket, head) {
    // const origin = request && request.headers && request.headers.origin;
    // const corsRegex = /^https?:\/\/(.*\.?)abc\.com(:\d+)?\/$/g

    const { pathname } = new URL(
      String(request.url),
      `https://${request.headers.host}`,
    );

    switch (pathname) {
      case '/api/room':
        wsServer.handleUpgrade(request, socket, head, function done(ws) {
          wsServer.emit('connection', ws, request);
        });
        break;
      default:
        socket.destroy();
    }
  });
}
