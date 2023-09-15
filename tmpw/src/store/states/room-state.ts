import { Instantiable } from '@utils/instantiable';

export class Participant extends Instantiable<Participant> {
  id!: string;
  username!: string;
}

export class Room extends Instantiable<Room> {
  id!: string;
  name!: string;
  description!: string;
  hostId!: string;
  participants!: Participant[];
}

export type RoomState = {
  rooms: Map<string, Room>;
  appendRoom: (room: Room) => void;
};
