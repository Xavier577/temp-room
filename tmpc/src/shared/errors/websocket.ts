export enum WsErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  BAD_USER_INPUT = 'BAD_USER_INPUT',
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
