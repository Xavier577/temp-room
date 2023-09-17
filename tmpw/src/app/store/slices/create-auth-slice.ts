import { StateCreator } from 'zustand';
import getCookie from '@app/utils/get-cookie';
import setCookie from '@app/utils/set-cookie';
import { AppState } from '@app/store/states';
import { AuthTokenState } from '@app/store/states/auth-token-state';

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
    setCookie('access_token', newToken, { path: '/' });
    set({ accessToken: newToken });
  },
});

export default createAuthSlice;
