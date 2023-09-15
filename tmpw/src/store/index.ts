import { create } from 'zustand';
import createAuthSlice from '@store/slices/create-auth-slice';
import createUserSlice from '@store/slices/create-user-slice';
import { AppState } from '@store/states';
import createRoomSlice from '@store/slices/create-room-slice';

const useAppStore = create<AppState>((...a) => ({
  ...createAuthSlice(...a),
  ...createUserSlice(...a),
  ...createRoomSlice(...a),
}));

export default useAppStore;
