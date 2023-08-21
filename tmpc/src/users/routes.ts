import { Router } from 'express';
import userController from './controller';
import { WatchAsyncController } from '../shared/utils/watch-async-controller';
import { PartialInstantiable } from '../shared/utils/partial-instantiable';
import crypto from 'crypto';

const userRouter = Router();

class Users extends PartialInstantiable<Users> {
  id: string;
  username: string;
}

const users: Users[] = [
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

userRouter.get('/', WatchAsyncController(userController.getUser));

userRouter.post('/', (req, res) => {
  const user = new Users(req.body);

  user.id = crypto.randomUUID();

  users.push(user);

  res.send(user);
});

userRouter.get('/all', (_req, res) => {
  res.status(200).json(users);
});

export default userRouter;
