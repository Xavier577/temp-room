import { StateCreator } from 'zustand';
import { AppState, Room, RoomState } from '@store/states';

const createRoomSlice: StateCreator<AppState, [], [], RoomState> = (set) => ({
  rooms: new Map<string, Room>(),
  appendRoom: (room: Room) => {
    set(({ rooms }) => {
      rooms.set(room.id, room);
      return { rooms };
    });
  },
});

export default createRoomSlice;
