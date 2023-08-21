import { Request, Response, NextFunction } from 'express';

export type ExpressController = (
  req: Request,
  res: Response,
  next?: NextFunction,
) => any;

export type SessionAccount = {
  id: string;
};

export type BufferLike =
  | string
  | Buffer
  | DataView
  | number
  | ArrayBufferView
  | Uint8Array
  | ArrayBuffer
  | SharedArrayBuffer
  | ReadonlyArray<any>
  | ReadonlyArray<number>
  | { valueOf(): ArrayBuffer }
  | { valueOf(): SharedArrayBuffer }
  | { valueOf(): Uint8Array }
  | { valueOf(): ReadonlyArray<number> }
  | { valueOf(): string }
  | { [Symbol.toPrimitive](hint: string): string };
