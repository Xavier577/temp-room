import * as crypto from 'crypto';
import { CreateNullClass } from '../../shared/utils/null-class';

interface Room {
  id: string;
  name: string;
  description: string;
  hostId: string;
  participants: { id: string; role: 'host' | 'member' }[];
}

const Rooms: Room[] = [
  {
    id: '2cb0721f-33ef-413f-9a71-882293c1fe4f',
    name: 'Room B',
    description: 'For Room B',
    hostId: '40213eec-cd84-42f6-a014-a4b70095dcb6',
    participants: [
      {
        id: '40213eec-cd84-42f6-a014-a4b70095dcb6',
        role: 'host',
      },
    ],
  },
  {
    id: '7d3029b4-39ac-4165-b315-dc72f5ce871b',
    name: 'ROOM A',
    description: 'For class A',
    hostId: 'be0a45c0-dbc6-48c2-80a6-192b19e45016',
    participants: [
      {
        id: 'be0a45c0-dbc6-48c2-80a6-192b19e45016',
        role: 'host',
      },
    ],
  },
];

export class RoomService {
  public create(data: Omit<Room, 'id' | 'participants'>): Room {
    const room: Room = {
      id: crypto.randomUUID().toString(),
      name: data.name,
      description: data.description,
      hostId: data.hostId,
      participants: [{ id: data.hostId, role: 'host' }],
    };

    Rooms.push(room);

    return room;
  }

  public joinRoom(roomId: string, userId: string): Room {
    const room = Rooms?.find?.((r) => r.id === roomId);

    if (room == null) {
      return CreateNullClass<Room>();
    }

    room.participants.push({ id: userId, role: 'member' });

    return room;
  }

  public get(id: string): Room | undefined {
    return Rooms?.find?.((room) => room.id === id);
  }

  public getAllRooms(): Room[] {
    return Rooms;
  }
}

const roomService = new RoomService();

export default roomService;
