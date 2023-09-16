import * as https from 'https';
import http from 'http';
import { WebSocketServer } from 'ws';
import Logger from '../logger';
import { handleWsConnect } from './handlers/handle-ws-connect';

export function websocketServer(server: http.Server | https.Server) {
  const wsServer = new WebSocketServer({ noServer: true });

  const logger = new Logger(websocketServer.name);

  wsServer.on('connection', handleWsConnect(wsServer));

  server.on('upgrade', function upgrade(request, socket, head) {
    logger.log('ESTABLISHING_CONNECTION');

    logger.log(JSON.stringify(request.headers));

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
