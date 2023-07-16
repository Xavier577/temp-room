import { Request, Response } from 'express';
import userService, { UserService } from './services/user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  public getUser = async (req: Request, res: Response) => {
    const id = (<Request & { user: { id: string } }>req).user.id;

    const user = await this.userService.getUserById(id);

    res.status(200).json(user);
  };
}

const userController = new UserController(userService);

export default userController;
