import userService, { UserService } from '../users/services/user.service';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { BadException } from '../shared/errors/http';
import { CreateNullClass } from '../shared/utils/null-class';
import hashingService, {
  HashingService,
} from '../shared/services/hashing/hashing.service';
import tokenService, {
  TokenService,
} from '../shared/services/token/token.service';

export class AuthController {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  public login = async (req: Request, res: Response): Promise<void> => {
    const payload = new LoginDto(req.body);

    let user: User = CreateNullClass<User>();

    if (payload.email != null) {
      user = await this.userService.getUserByEmail(payload.email);
    } else if (payload.username != null) {
      user = await this.userService.getUserByUsername(payload.username);
    }

    if (user == null) {
      throw new BadException();
    }

    const PASSWORD_IS_CORRECT = await this.hashingService.compare(
      payload.password,
      user.password,
    );

    if (!PASSWORD_IS_CORRECT) {
      throw new BadException('INCORRECT_PASSWORD');
    }

    const token = await this.tokenService.generateAsync({ id: user.id });

    res.status(200).json({ token });
  };
}

const authController = new AuthController(
  hashingService,
  tokenService,
  userService,
);

export default authController;
