import { PartialInstantiable } from '../../shared/utils/partial-instantiable';

export class Room extends PartialInstantiable<Room> {
  id: string;
  name: string;
  description: string;
  hostId: string;
  participants: { id: string }[];
}
