import { PartialInstantiable } from '../../shared/utils/partial-instantiable';

export class SignupDto extends PartialInstantiable<SignupDto> {
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  password: string;
}
