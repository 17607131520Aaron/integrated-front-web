export interface IMenuItem {
  id: string;
  key: string;
  title: string;
  label: string;
  code: string;
  path: string;
  icon?: React.ReactNode | null;
  sortOrder: number;
  children?: Array<IMenuItem> | undefined;
}

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

// 初始状态
export const initialState: IUserState = {
  userList: [],
  userDetail: {},
  routerList: [],
};

export interface IRouterItem {
  path: string;
  name: string;
  icon?: string;
  children?: IRouterItem[];
  [key: string]: unknown;
}
