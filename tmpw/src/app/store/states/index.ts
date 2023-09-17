import { AuthTokenState } from '@app/store/states/auth-token-state';
import { UserState } from '@app/store/states/user-state';
import { RoomState } from '@app/store/states/room-state';

export type AppState = AuthTokenState & UserState & RoomState;

export * from '@app/store/states/auth-token-state';
export * from '@app/store/states/user-state';
export * from '@app/store/states/room-state';
