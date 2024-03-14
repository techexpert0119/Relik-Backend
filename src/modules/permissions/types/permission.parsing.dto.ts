import {
  ENUM_PERMISSION_ACTION,
  ENUM_PERMISSION_TYPE,
} from '../constants/permission.enum.constant';

export type PermissionParsingInputData = {
  action: ENUM_PERMISSION_ACTION;
  type: ENUM_PERMISSION_TYPE[];
}[];
