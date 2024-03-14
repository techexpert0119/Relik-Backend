import { Role } from 'src/modules/role/entities/role.entity';

export type UserTokenInfo = {
  sub: string;
  role: Role;
  iat?: number;
  exp?: number;
  sessionId: string;
};
