import InjectableMiddlewareBuilder from '../utils/injectable-middleware.builder';
import userService, {
  UserService,
  UserServiceImpl,
} from '../../users/services/user.service';
import { SessionAccount } from '../types';
import { ConflictException, UnAuthorizedException } from '../errors';

const QuerySessionUserMiddleware = new InjectableMiddlewareBuilder(
  userService,
).configure(async (ctx) => {
  const request = ctx.getRequest();

  const sessionAccount = (request as any).session['account'] as SessionAccount;

  if (sessionAccount == null) {
    throw new UnAuthorizedException();
  }

  const userService = ctx.getDep<UserService>(UserServiceImpl);

  const userAccount = await userService.getUserId(sessionAccount.id);

  if (userAccount == null) {
    throw new ConflictException(
      'user account does not exit or may have been deleted',
    );
  }

  (request as any).account = userAccount;

  ctx.next();
});

export default QuerySessionUserMiddleware;
