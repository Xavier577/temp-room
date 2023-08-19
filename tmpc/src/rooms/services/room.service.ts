import * as crypto from 'crypto';

const Rooms: any[] = [];

export class RoomService {
  public create(data: any) {
    const room = {
      id: crypto.randomUUID(),
      ...data,
    };

    Rooms.push(room);

    return room;
  }

  public get(id: string) {
    return Rooms?.find((room) => room?.id === id);
  }

  public getAllRooms() {
    return Rooms;
  }
}

const roomService = new RoomService();

export default roomService;
