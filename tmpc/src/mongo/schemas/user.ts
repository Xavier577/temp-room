import mongoose from 'mongoose';

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  profileImg: string;
}

export const userSchema = new mongoose.Schema<User>(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    profileImg: String,
  },
  { timestamps: true },
);

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
