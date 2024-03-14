import { Role, RoleDoc } from 'src/modules/role/entities/role.entity';
import { UserDoc, User } from 'src/modules/user/entities/user.entity';

export interface IUser extends Omit<User, 'role'> {
  role: Role;
}

export interface IUserDoc extends Omit<UserDoc, 'role'> {
  role: RoleDoc;
}

export interface IUserGoogleEntity {
  accessToken: string;
  refreshToken: string;
}
export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  email?: string;
}
