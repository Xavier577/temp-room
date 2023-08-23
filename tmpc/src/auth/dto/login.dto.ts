import { PartialInstantiable } from '../../shared/utils/partial-instantiable';

export class LoginDto extends PartialInstantiable<LoginDto> {
  username?: string;
  email?: string;
  password: string;
}
