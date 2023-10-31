import { useState } from 'react';
import { opt } from 'ts-interface-checker';

export type UseWebsocketOptions = Partial<{
  /** if true would set ws to `undefined` when socket connection is closed. `default true`*/
  resetStateOnClose: boolean;
  onOpen: (ws: WebSocket, event: Event) => void;
  onMessage: (ws: WebSocket, event: MessageEvent<any>) => void;
  onError: (event: Event) => void;
  onClose: (event: CloseEvent) => void;
}>;

export interface ConnectSocketOptions
  extends Omit<UseWebsocketOptions, 'resetStateOnClose'> {
  protocols?: string | string[];
}

export function useWebsocket(
  options: UseWebsocketOptions = { resetStateOnClose: true },
) {
  const [ws, setWs] = useState<WebSocket>();

  if (options != null && options.resetStateOnClose == null) {
    options.resetStateOnClose = true;
  }

  const connectSocket = (
    url: string,
    connectOptions?: ConnectSocketOptions,
  ) => {
    const socket = new WebSocket(url, connectOptions?.protocols);

    const onOpen = connectOptions?.onOpen ?? options?.onOpen;
    const onMessage = connectOptions?.onMessage ?? options?.onMessage;
    const onError = connectOptions?.onError ?? options?.onError;
    const onClose = connectOptions?.onClose ?? options?.onClose;

    const wsOpenPromise = new Promise<WebSocket>((res) => {
      socket.addEventListener('open', (event) => {
        setWs(socket);
        onOpen?.(socket, event);
        res(socket);
      });
    });

    if (connectOptions?.onMessage != null || options?.onMessage != null) {
      socket.addEventListener('message', (event) => {
        onMessage?.(socket, event);
      });
    }

    if (connectOptions?.onError != null || options?.onError != null) {
      socket.addEventListener('error', (event) => {
        onError?.(event);
      });
    }

    socket.addEventListener('close', (event) => {
      if (options.resetStateOnClose) setWs(undefined);
      onClose?.(event);
    });

    return wsOpenPromise;
  };

  return [ws, connectSocket] as const;
}
