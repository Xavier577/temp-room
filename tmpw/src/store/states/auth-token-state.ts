export type AuthTokenState = {
    accessToken: string
    getAccessToken: () => string
    updateAccessToken: (newToken: string) => void
}