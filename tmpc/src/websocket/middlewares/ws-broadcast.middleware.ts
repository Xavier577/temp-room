import WebSocket, { WebSocketServer } from 'ws';
import { BufferLike } from '../../shared/types';

export type WsBroadcastFn = (
  data: BufferLike,
  options?: Partial<{
    /** if true would broadcast to all connected WebSocket clients, including itself `default: true` */
    includeSelf: boolean;
    /** function to decided if a client would be included with broadcast */
    shouldBroadcastOnlyIf: (client: WebSocket) => boolean | Promise<boolean>;
    /** function to executed after broadcast */
    afterBroadcast: () => void | Promise<void>;
  }>,
) => void;

export const WsBroadcastMiddleware = (
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

    if (options.shouldBroadcastOnlyIf == null) {
      options.shouldBroadcastOnlyIf = () => true;
    }

    const broadcastToClient = (client: WebSocket) => {
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
    };

    wsServer.clients.forEach((client) => {
      if (options?.shouldBroadcastOnlyIf != null) {
        try {
          const shouldBroadcast = options.shouldBroadcastOnlyIf(client);

          if (shouldBroadcast instanceof Promise) {
            shouldBroadcast
              .then((s) => {
                if (s) {
                  broadcastToClient(client);
                }
              })
              .catch((e) => {
                ws.emit('error', e);
              });
          } else if (shouldBroadcast) {
            broadcastToClient(client);
          }
        } catch (e) {
          ws.emit('error', e);
        }

        return;
      }

      broadcastToClient(client);
    });

    try {
      // exec function after broadcast has been completed
      const p = options?.afterBroadcast?.();

      if (p != null) {
        p?.catch?.((e) => {
          ws.emit('error', e);
        });
      }
    } catch (e) {
      ws.emit('error', e);
    }
  };
};
