import mongoose from 'mongoose';
import UserModel from './user';

export interface Room {
  name: string;
  description: string;
  host: typeof UserModel;
  participants: (typeof UserModel)[];
}

export const roomSchema = new mongoose.Schema<Room>({
  name: String,
  description: String,
  host: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  participants: {
    type: [mongoose.Types.ObjectId],
    ref: 'User',
  },
});

const RoomModel = mongoose.model('Room', roomSchema);

export default RoomModel;
