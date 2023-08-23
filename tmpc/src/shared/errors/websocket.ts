export enum WsErrorCode {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export class WsException extends Error {
  constructor(
    public readonly code: WsErrorCode,
    public readonly message: string,
  ) {
    super(message);
  }
}
