import { PartialInstantiable } from '../../shared/utils/partial-instantiable';

export class User extends PartialInstantiable<User> {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  profileImg: string;
}
