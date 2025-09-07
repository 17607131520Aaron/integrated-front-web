import { createSlice } from '@reduxjs/toolkit';

import type { IUser, IUserState } from './type';
import type { PayloadAction } from '@reduxjs/toolkit';

// 初始状态
const initialState: IUserState = {
  userList: [],
  userDetail: {},
  routerList: [],
};

// 创建 slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 添加用户
    addUser: (state, action: PayloadAction<IUser>) => {
      state.userList.push(action.payload);
    },

    // 更新用户
    updateUser: (state, action: PayloadAction<IUser>) => {
      const index = state.userList.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.userList[index] = action.payload;
      }
    },

    // 删除用户
    deleteUser: (state, action: PayloadAction<{ id: string | number }>) => {
      state.userList = state.userList.filter(user => user.id !== action.payload.id);
    },

    // 设置用户详情
    setUser: (state, action: PayloadAction<IUser>) => {
      state.userDetail = action.payload;
    },

    // 设置用户列表
    setUserList: (state, action: PayloadAction<IUser[]>) => {
      state.userList = action.payload;
    },

    // 设置用户详情
    setUserDetail: (state, action: PayloadAction<IUser>) => {
      state.userDetail = action.payload;
    },

    setMenuData: (state, actions) => {
      state.routerList = actions.payload;
    },
  },
});

// 导出 actions
export const { addUser, updateUser, deleteUser, setUser, setUserList, setUserDetail, setMenuData } =
  userSlice.actions;

// 导出 reducer
export default userSlice.reducer;
