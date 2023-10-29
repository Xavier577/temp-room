import { StateCreator } from 'zustand';
import { AppState, Room, RoomState } from '@app/store/states';

const createRoomSlice: StateCreator<AppState, [], [], RoomState> = (set) => ({
  rooms: new Map<string, Room>(),
  appendRoom: (room: Room) => {
    set(({ rooms }) => {
      const mutMap = new Map(rooms.entries());

      mutMap.set(room.id, room);

      return { rooms: mutMap };
    });
  },
});

export default createRoomSlice;
