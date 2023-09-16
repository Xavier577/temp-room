import { Types } from 'mongoose';

export default async function parseAsyncObjectId(
  id: string,
): Promise<Types.ObjectId> {
  return new Promise((res, rej) => {
    try {
      const objId = new Types.ObjectId(id);
      res(objId);
    } catch (e) {
      rej(e);
    }
  });
}
