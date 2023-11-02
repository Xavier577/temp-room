import { PartialInstantiable } from '../../shared/utils/partial-instantiable';
import { User } from '../../users/entities/user.entity';

export class Message extends PartialInstantiable<Message> {
  id: string;
  text: string;
  delivered: boolean;
  sentAt: Date;
  sender: Pick<User, 'id' | 'username'>;
  roomId: string;
}
