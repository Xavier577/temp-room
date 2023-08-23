import { PartialInstantiable } from '../../shared/utils/partial-instantiable';

export class Message extends PartialInstantiable<Message> {
  id: string;
  text: string;
  delivered: boolean;
  sentAt: Date;
  senderId: string;
  roomId: string;
}
