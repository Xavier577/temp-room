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
import { SignupDto } from './dto/signup.dto';
import Exclude from '../shared/utils/exclude';
import { LOGIN_MODE } from '../shared/enums';

export class AuthController {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  public signup = async (req: Request, res: Response): Promise<void> => {
    const payload = new SignupDto(req.body);

    const userWithEmail = await this.userService.getUserByEmail(payload.email);

    if (userWithEmail != null) {
      throw new BadException('User already exist with email');
    }

    const userWithUsername = await this.userService.getUserByUsername(
      payload.username,
    );

    if (userWithUsername != null) {
      throw new BadException('Username is already taken');
    }

    const hashedPassword = await this.hashingService.hash(payload.password);

    const user = await this.userService.createUser({
      email: payload.email,
      username: payload.username,
      password: hashedPassword,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });

    const serializedUser = Exclude(user, ['password']);

    const token = await this.tokenService.generateAsync({ id: user.id });

    res.status(200).json({ token, user: serializedUser });
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const payload = new LoginDto(req.body);

    let user: User = CreateNullClass<User>();

    if (payload.email != null) {
      user = await this.userService.getUserByEmail(payload.email);
    } else if (payload.username != null) {
      user = await this.userService.getUserByUsername(payload.username);
    }

    if (user == null) {
      if (payload.mode == LOGIN_MODE.USERNAME) {
        throw new BadException('Invalid username');
      }
      if (payload.mode == LOGIN_MODE.EMAIL) {
        throw new BadException('Invalid email');
      }
    }

    const PASSWORD_IS_CORRECT = await this.hashingService.compare(
      payload.password,
      user.password,
    );

    if (!PASSWORD_IS_CORRECT) {
      throw new BadException('Incorrect password');
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
