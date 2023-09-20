import { StateCreator } from 'zustand';
import getCookie from '@app/utils/get-cookie';
import setCookie from '@app/utils/set-cookie';
import { AppState } from '@app/store/states';
import { AuthTokenState } from '@app/store/states/auth-token-state';
import { Duration } from '@app/enums/duration';

const createAuthSlice: StateCreator<AppState, [], [], AuthTokenState> = (
  set,
) => ({
  accessToken: '',
  getAccessToken: () => {
    const accessToken = <string>getCookie('access_token');

    set({ accessToken });

    return accessToken;
  },
  updateAccessToken: (newToken: string) => {
    const expires = new Date();

    const SIXTY_DAYS = 60 * Duration.DAY;

    expires.setTime(expires.getTime() + SIXTY_DAYS);

    setCookie('access_token', newToken, { path: '/', expires });

    set({ accessToken: newToken });
  },
});

export default createAuthSlice;
