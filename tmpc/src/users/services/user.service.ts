import { UserEntity } from '../entities/user.entity';
import { CreateNullClass } from '../../shared/utils/null-class';
import { PartialInstantiable } from '../../shared/utils/partial-instantiable';

class User extends PartialInstantiable<User> {
  id: string;
  username: string;
}

const users: User[] = [
  {
    username: 'xavier1',
    id: 'be0a45c0-dbc6-48c2-80a6-192b19e45016',
  },
  {
    username: 'xavier2',
    id: '40213eec-cd84-42f6-a014-a4b70095dcb6',
  },
  {
    username: 'xavier3',
    id: '37032a0d-e914-4a44-83da-8c248f90aec3',
  },
  {
    username: 'xavier4',
    id: '76684879-a101-4956-959d-e16ddfaad746',
  },
  {
    username: 'xavier5',
    id: 'ba72cb94-a3a0-431c-8c34-1ac0ab895c80',
  },
];

export interface UserService {
  getUserById(id: string): UserEntity;
  getUser(id: string): User;
}

export class UserServiceImpl implements UserService {
  getUserById(_id: string): UserEntity {
    return CreateNullClass<UserEntity>();
  }

  public getUser(id: string): User {
    const user = users.find((u) => u.id === id);

    if (user == null) {
      return CreateNullClass<User>();
    }

    return user;
  }
}

const userService: UserService = new UserServiceImpl();

export default userService;
