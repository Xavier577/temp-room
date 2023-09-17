import { create } from 'zustand';
import createAuthSlice from '@app/store/slices/create-auth-slice';
import createUserSlice from '@app/store/slices/create-user-slice';
import { AppState } from '@app/store/states';
import createRoomSlice from '@app/store/slices/create-room-slice';

const useAppStore = create<AppState>((...a) => ({
  ...createAuthSlice(...a),
  ...createUserSlice(...a),
  ...createRoomSlice(...a),
}));

export default useAppStore;
