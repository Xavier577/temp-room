import mongoose from 'mongoose';
import UserModel, { User as MUser } from '../../mongo/schemas/user';
import { CreateNullClass } from '../../shared/utils/null-class';
import { User } from '../entities/user.entity';

export interface CreateUserData extends Partial<Omit<User, 'id'>> {
  email: string;
  username: string;
  password: string;
}

export type UpdateUserData = Partial<
  Pick<User, 'firstName' | 'lastName' | 'profileImg'>
>;

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userModel: mongoose.Model<MUser>) {}

  public async create(data: CreateUserData): Promise<User> {
    const user = await this.userModel.create({
      email: data.email,
      username: data.firstName,
      firstName: data.firstName,
      lastName: data.firstName,
      password: data.password,
      profileImg: data.profileImg,
    });

    return new User({
      id: user._id.toString(),
      email: user.email,
      username: user.firstName,
      firstName: user.firstName,
      lastName: user.firstName,
      password: user.password,
      profileImg: user.profileImg,
    });
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (user == null) {
      return CreateNullClass();
    }

    return new User({
      id: user._id.toString(),
      email: user.email,
      username: user.firstName,
      firstName: user.firstName,
      lastName: user.firstName,
      password: user.password,
      profileImg: user.profileImg,
    });
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (user == null) {
      return CreateNullClass();
    }

    return new User({
      id: user._id.toString(),
      email: user.email,
      username: user.firstName,
      firstName: user.firstName,
      lastName: user.firstName,
      password: user.password,
      profileImg: user.profileImg,
    });
  }

  public async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });

    if (user == null) {
      return CreateNullClass();
    }

    return new User({
      id: user._id.toString(),
      email: user.email,
      username: user.firstName,
      firstName: user.firstName,
      lastName: user.firstName,
      password: user.password,
      profileImg: user.profileImg,
    });
  }

  public async update(id: string, data: UpdateUserData): Promise<User> {
    const updateQuery: mongoose.UpdateQuery<MUser> = {};

    if (data.firstName != null) {
      updateQuery.firstName = data.firstName;
    }

    if (data.lastName != null) {
      updateQuery.lastName = data.lastName;
    }

    if (data.profileImg != null) {
      updateQuery.profileImage = data.profileImg;
    }

    const user = await this.userModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    if (user == null) {
      return CreateNullClass();
    }

    return new User({
      id: user._id.toString(),
      email: user.email,
      username: user.firstName,
      firstName: user.firstName,
      lastName: user.firstName,
      password: user.password,
      profileImg: user.profileImg,
    });
  }
}

const userRepository: UserRepository = new UserRepositoryImpl(UserModel);

export default userRepository;
