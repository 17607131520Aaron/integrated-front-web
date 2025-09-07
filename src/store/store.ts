import { combineReducers } from 'redux';

import userReducer from './userStore/userSlice';

// 使用 combineReducers 合并所有 reducer
const rootReducer = combineReducers({
  userInfo: userReducer,
  // 其他 reducer 可以在这里添加
});

// 需要持久化的 reducer 列表
const whitelist = ['userInfo', 'routersData'];

export { rootReducer, whitelist };
