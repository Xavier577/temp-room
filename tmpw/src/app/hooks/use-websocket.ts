import { useState } from 'react';

export type UseWebsocketOptions = Partial<{
  /** if true would set ws to `undefined` when socket connection is closed. `default true`*/
  resetStateOnClose: boolean;
  onOpen: (ws: WebSocket, event: Event) => void;
  onMessage: (ws: WebSocket, event: MessageEvent<any>) => void;
  onError: (event: Event) => void;
  onClose: (event: CloseEvent) => void;
}>;

export function useWebsocket(
  options: UseWebsocketOptions = { resetStateOnClose: true },
) {
  const [ws, setWs] = useState<WebSocket>();

  if (options != null && options.resetStateOnClose == null) {
    options.resetStateOnClose = true;
  }

  const connectSocket = (url: string, protocols?: string | string[]) => {
    const socket = new WebSocket(url, protocols);

    socket.addEventListener('open', (event) => {
      setWs(socket);
      options?.onOpen?.(socket, event);
    });

    if (options?.onMessage != null) {
      socket.addEventListener('message', (event) => {
        options?.onMessage?.(socket, event);
      });
    }

    if (options?.onError != null) {
      socket.addEventListener('error', (event) => {
        options?.onError?.(event);
      });
    }

    socket.addEventListener('close', (event) => {
      if (options.resetStateOnClose) setWs(undefined);
      options?.onClose?.(event);
    });
  };

  return [ws, connectSocket] as const;
}
