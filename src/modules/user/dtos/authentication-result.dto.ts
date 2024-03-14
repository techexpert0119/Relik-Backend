import { Tokens } from '../../../common/auth/types';
import { UserDoc } from '../entities/user.entity';
import { RoleDoc } from '../../role/entities/role.entity';
import { AgencyDoc } from 'src/modules/agency/entities/agency.entity';

export interface IUserForToken {
  id: string;
  email: string;
  firstName: string;
  isActive: boolean;
  permissions: String[];
  role: RoleDoc;
  photo?: string | String;
  currentAgency?: undefined | string;
}

export default class AuthenticationResultDto {
  token: Tokens;
  user: IUserForToken;
  agencies?: AgencyDoc[];

  public static fromDocs(user: UserDoc, userRole: RoleDoc) {
    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      firstName: user.firstName,
      permissions: [...user.permissions, ...userRole.permissions],
      role: userRole,
      photo: user.photo,
      currentAgency: user?.currentAgency,
    } satisfies IUserForToken;
  }
}
