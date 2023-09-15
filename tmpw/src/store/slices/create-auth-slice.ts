import {StateCreator} from "zustand";
import getCookie from "@utils/get-cookie";
import setCookie from "@utils/set-cookie";
import {AppState} from "@store/states";
import {AuthTokenState} from "@store/states/auth-token-state";


const createAuthSlice: StateCreator<AppState, [], [], AuthTokenState> = (set) => ({
    accessToken: "",
    getAccessToken: () => {
        const accessToken = <string>getCookie('access_token')

        set({accessToken})

        return accessToken
    },
    updateAccessToken: (newToken: string) => {
        setCookie('access_token', newToken, {path: '/'})
        set({accessToken: newToken})
    }
})

export default createAuthSlice
