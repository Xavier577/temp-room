import RoomModel from './room';
import UserModel from './user';
import mongoose from 'mongoose';

export interface Message {
  room: typeof RoomModel;
  sender: typeof UserModel;
  text: string;
  sentAt: Date;
  delivered: boolean;
}

export const messageSchema = new mongoose.Schema<Message>(
  {
    room: {
      type: mongoose.Types.ObjectId,
      ref: 'Room',
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    text: String,
    delivered: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true },
);

const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;
