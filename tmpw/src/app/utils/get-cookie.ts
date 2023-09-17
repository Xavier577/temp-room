export default function getCookie(name: string): string | null {
    if ('window' in global) {
        const cookieString = document.cookie;

        const cookies = cookieString.split('; ');

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=');

            if (cookie[0] === name) {
                return decodeURIComponent(cookie[1]);
            }

        }
        return null;
    }

    return null;
}