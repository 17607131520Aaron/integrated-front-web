import type { IMenuItem } from '@/types/base';

// 定义用户类型接口
export interface IUser {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

// 定义状态类型
export interface IUserState {
  userList: IUser[];
  userDetail: IUser | Record<string, never>;
  routerList: Array<IMenuItem>;
}

export interface IRouterItem {
  path: string;
  name: string;
  icon?: string;
  children?: IRouterItem[];
  [key: string]: unknown;
}
