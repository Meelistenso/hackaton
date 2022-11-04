import { UserRolesEnum } from '../../../modules/utils/enums';

export interface IUserWsContext {
  userId?: string;
  userRole?: UserRolesEnum;
  token?: string;
}
