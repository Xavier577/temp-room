import { Request, Response } from 'express';
import Exclude from '../shared/utils/exclude';
import { User } from './entities/user.entity';

export class Controller {
  constructor() {}

  public getUser = async (req: Request, res: Response) => {
    const user = (<Request & { user: User }>req).user;

    res.status(200).json(Exclude(user, ['password']));
  };
}

const userController = new Controller();

export default userController;
