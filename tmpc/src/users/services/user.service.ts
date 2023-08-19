import {UserEntity} from "../entities/user.entity";
import {CreateNullClass} from "../../shared/utils/null-class";

export interface UserService {
    getUserById(id: string): UserEntity
}

export class UserServiceImpl implements UserService{
    getUserById(_id: string): UserEntity {
        return CreateNullClass<UserEntity>();
    }
}


const userService = new UserServiceImpl()

export default userService;
