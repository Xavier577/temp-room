import http from 'http';
import { WebSocketServer } from 'ws';
import { WsPayload } from './dtos/ws-payload';
import { WsMessage } from './dtos/ws-message';
import { WsErrorCode, WsException } from '../shared/errors/websocket';
import Logger from '../logger';
import * as https from 'https';
import roomWebsocketHandler from '../rooms/websocket.handler';
import { WsBoardCastMiddleware } from './middlewares/ws-board-cast.middleware';

export function websocketServer(server: http.Server | https.Server) {
  const wsServer = new WebSocketServer({ noServer: true });

  const logger = new Logger(websocketServer.name);

  wsServer.on('connection', (ws) => {
    logger.log('CONNECTION_ESTABLISHED');

    ws.on('message', (message, isBinary) => {
      logger.log('RECEIVED_MESSAGE');

      logger.log(message.toString());
      try {
        const parsedData = JSON.parse(message.toString());

        const payload = new WsPayload(parsedData);

        const broadcastFn = WsBoardCastMiddleware(ws, wsServer, isBinary);

        (ws as any).userId = payload.data?.userId;

        switch (payload.event) {
          case 'join_room':
            // join room
            roomWebsocketHandler.joinRoom(payload, ws, broadcastFn);

            // {
            //   const msg = new WsMessage<any>({
            //     data: {
            //       message: `you have joined room ${payload.data?.roomId}`,
            //     },
            //     event: payload.event,
            //   }).stringify();
            //
            //   wsServer.clients.forEach((client) => {
            //     if (client != ws && client.readyState === WebSocket.OPEN) {
            //       client.send(msg, { binary: isBinary });
            //     }
            //   });
            // }

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
  });

  server.on('upgrade', function upgrade(request, socket, head) {
    logger.log(JSON.stringify(request.headers));

    logger.log('ESTABLISHING_CONNECTION');

    // validate connections before accepting

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
