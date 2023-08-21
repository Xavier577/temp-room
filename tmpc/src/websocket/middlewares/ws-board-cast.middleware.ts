import WebSocket, { WebSocketServer } from 'ws';
import { BufferLike } from '../../shared/types';

export type WsBroadcastFn = (
  data: BufferLike,
  options?: Partial<{
    /** if true would broadcast to all connected WebSocket clients, including itself `default: true` */
    includeSelf: boolean;
    /** function to decided if a client would be included with broadcast */
    shouldBroadCastOnlyIf: (client?: WebSocket) => boolean;
  }>,
) => void;

export const WsBoardCastMiddleware = (
  ws: WebSocket,
  wsServer: WebSocketServer,
  isBinary = false,
): WsBroadcastFn => {
  return (data, options) => {
    if (options == null) {
      options = {};
    }

    if (options.includeSelf == null) {
      options.includeSelf = true;
    }

    if (options.shouldBroadCastOnlyIf == null) {
      options.shouldBroadCastOnlyIf = (_client?: WebSocket) => true;
    }

    wsServer.clients.forEach((client) => {
      if (options?.shouldBroadCastOnlyIf?.(client)) {
        const INCLUDE_SELF_WHILE_SOCKET_IS_OPEN =
          options?.includeSelf == true && client.readyState === WebSocket.OPEN;

        const BROADCAST_WHILE_SOCKET_IS_OPEN =
          client != ws && client.readyState === WebSocket.OPEN;

        switch (true) {
          case INCLUDE_SELF_WHILE_SOCKET_IS_OPEN:
            client.send(data, { binary: isBinary });
            break;
          case BROADCAST_WHILE_SOCKET_IS_OPEN:
            client.send(data, { binary: isBinary });
            break;
        }
      }
    });
  };
};
