import { PartialInstantiable } from '../../shared/utils/partial-instantiable';
import { WsErrorCode } from '../../shared/errors/websocket';

export class WsMessage<T = any> extends PartialInstantiable<WsMessage<T>> {
  data: T;
  event: string;
  status: string;
  error: {
    code: WsErrorCode;
    message: string;
  };

  public stringify(): string {
    return JSON.stringify(this);
  }
}
