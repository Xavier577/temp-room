import { PartialInstantiable } from '../../shared/utils/partial-instantiable';

export class WsPayload<T = any> extends PartialInstantiable<WsPayload<T>> {
  data: T;
  event: string;
}
