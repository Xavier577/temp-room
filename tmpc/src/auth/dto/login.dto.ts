import { PartialInstantiable } from '../../shared/utils/partial-instantiable';
import { LOGIN_MODE } from '../../shared/enums';

export class LoginDto extends PartialInstantiable<LoginDto> {
  mode?: LOGIN_MODE;
  username?: string;
  email?: string;
  password: string;
}
