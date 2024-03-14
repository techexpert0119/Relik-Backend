import { RoleDoc } from 'src/modules/role/entities/role.entity';
import { IUserDoc } from 'src/modules/user/interfaces/user.interface';
import {
  ENUM_VERIFICATION_PURPOSE,
  ENUM_VERIFICATION_STATUS,
} from '../constants/varification.enum.constant';
import { Types } from 'mongoose';

export interface IPopolatedVerification {
  _id: Types.ObjectId;
  email: string;
  purpose: ENUM_VERIFICATION_PURPOSE;
  role: RoleDoc;
  createdBy: IUserDoc;
  agency: Types.ObjectId;
  invitedUser: IUserDoc;
  status: ENUM_VERIFICATION_STATUS;
  expireDate: Date;
}
