import { User } from '../entities/user.entity';
import userRepository, {
  CreateUserData,
  UpdateUserData,
  UserRepository,
} from '../repositories/user.respository';

export interface UserService {
  getUserById(id: string): Promise<User>;
  getUserByUsername(username: string): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
}

export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createUser(data: CreateUserData): Promise<User> {
    return this.userRepository.create(data);
  }

  public async getUserById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  public async getUserByUsername(username: string): Promise<User> {
    return this.userRepository.findByUsername(username);
  }

  public async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

  public async update(id: string, data: UpdateUserData): Promise<User> {
    return this.userRepository.update(id, data);
  }
}

const userService: UserService = new UserServiceImpl(userRepository);

export default userService;
