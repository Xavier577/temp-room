import { Instantiable } from '@app/utils/instantiable';

export class User extends Instantiable<User> {
  id!: string;
  email!: string;
  username!: string;
}

export type UserState = {
  user?: User;
  setUser: (user: User) => void;
};
