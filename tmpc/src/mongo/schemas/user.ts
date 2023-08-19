import mongoose from 'mongoose';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  profileImg: string;
}

const userSchema = new mongoose.Schema<User>(
  {
    firstName: {
      type: String,
    },
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImg: String,
  },
  { timestamps: true },
);

const UserModel = mongoose.model('users', userSchema);

export default UserModel;
