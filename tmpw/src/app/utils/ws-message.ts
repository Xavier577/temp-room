import { PartialInstantiable } from '@app/utils/partial-instantiable';
import { WsErrorCode } from '@app/enums/ws-error';

export class WsMessage<T = any> extends PartialInstantiable<WsMessage<T>> {
  data!: T;
  event!: string;
  status!: string;
  error!: {
    code: WsErrorCode;
    message: string;
  };

  public stringify(): string {
    return JSON.stringify(this);
  }
}
