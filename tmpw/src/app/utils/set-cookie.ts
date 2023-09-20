export interface SetCookieOption {
  expires?: Date;
  /** Default is "/" */
  path?: string;
}

export default function setCookie<T = any>(
  key: string,
  value: T,
  options?: SetCookieOption,
): void {
  if (options == null) {
    options = {} as SetCookieOption;
  }

  if (options.path == '' || options.path == null) {
    options.path = '/';
  }

  if ('window' in global) {
    const cookieData = `${key}=${value}`;

    let optionKeyValueList = [];

    for (const key in options) {
      let value = options[<keyof typeof options>key];

      if (value != null) {
        if (value instanceof Date) {
          value = value.toUTCString();
        }
        optionKeyValueList.push(`${key}=${value}`);
      }
    }

    const cookieOptions = optionKeyValueList.join('; ');

    document.cookie = `${cookieData}; ${cookieOptions}`;
  }
}
