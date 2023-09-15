export interface SetCookieOption {
  /** Default is "/" */
  path?: string;
}

export default function setCookie<T = any>(
  key: string,
  value: T,
  options?: SetCookieOption,
): void {
  if (options == null) {
    options = {};
  }

  if (options.path == '' || options.path == null) {
    options.path = '/';
  }

  if ('window' in global) {
    document.cookie = `${key}=${value}; path=${options.path}`;
    console.log(document.cookie);
  }
}
