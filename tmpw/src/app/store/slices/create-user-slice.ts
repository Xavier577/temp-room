import { StateCreator } from 'zustand';
import { AppState, UserState, User } from '@app/store/states';

const createUserSlice: StateCreator<AppState, [], [], UserState> = (set) => ({
  user: undefined,
  setUser: (user: User) => set({ user }),
});

export default createUserSlice;
