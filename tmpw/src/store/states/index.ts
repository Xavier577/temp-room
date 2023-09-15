import { AuthTokenState } from '@store/states/auth-token-state';
import { UserState } from '@store/states/user-state';
import { RoomState } from '@store/states/room-state';

export type AppState = AuthTokenState & UserState & RoomState;

export * from '@store/states/auth-token-state';
export * from '@store/states/user-state';
export * from '@store/states/room-state';
