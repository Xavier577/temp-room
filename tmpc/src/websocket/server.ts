import * as https from 'https';
import http from 'http';
import { WebSocketServer } from 'ws';
import { WsPayload } from './dtos/ws-payload';
import { WsMessage } from './dtos/ws-message';
import { WsErrorCode, WsException } from '../shared/errors/websocket';
import { WsBroadcastMiddleware } from './middlewares/ws-broadcast.middleware';
import Logger from '../logger';
import roomWebsocketHandler from '../rooms/websocket.handler';
import chatWebsocketHandler from '../chat/websocket.handler';
import { WsAuthMiddleware } from './middlewares/ws-auth.middleware';

export function websocketServer(server: http.Server | https.Server) {
  const wsServer = new WebSocketServer({ noServer: true });

  const logger = new Logger(websocketServer.name);

  wsServer.on('connection', (ws, request) => {
    logger.log('CONNECTION_ESTABLISHED');

    ws.on('error', (e) => {
      logger.error(e);

      if (e instanceof WsException) {
        const data = new WsMessage({
          status: 'error',
          error: { code: e.code, message: e.message },
        }).stringify();
        ws.send(data);

        if (e.code == WsErrorCode.INTERNAL_SERVER_ERROR) {
          // close connection if exception is internal server error
          ws.close();
        }
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

      ws.close();
    });

    ws.on('close', () => {
      logger.log('CONNECTION_CLOSED');
    });

    logger.log('AUTHENTICATING_CONNECTION');

    WsAuthMiddleware(ws, request).catch((e) => {
      ws.emit('error', e);
    });

    ws.on('message', (message, isBinary) => {
      logger.log('RECEIVED_MESSAGE');

      logger.log(message.toString());

      try {
        const parsedData = JSON.parse(message.toString());

        const payload = new WsPayload(parsedData);

        const broadcastFn = WsBroadcastMiddleware(ws, wsServer, isBinary);

        switch (payload.event) {
          case 'join_room':
            roomWebsocketHandler
              .joinRoom(payload, ws, broadcastFn)
              .catch((e) => {
                ws.emit('error', e);
              });
            break;
          case 'chat':
            chatWebsocketHandler
              .sendMessage(payload, ws, broadcastFn)
              .catch((e) => ws.emit('error', e));
            break;
          case 'leave':
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
    });
  });

  server.on('upgrade', function upgrade(request, socket, head) {
    logger.log('ESTABLISHING_CONNECTION');

    logger.log(JSON.stringify(request.headers));

    // validate connections before accepting

    // const origin = request && request.headers && request.headers.origin;
    // const corsRegex = /^https?:\/\/(.*\.?)abc\.com(:\d+)?\/$/g

    const { pathname } = new URL(
      String(request.url),
      `http://${request.headers.host}`,
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
