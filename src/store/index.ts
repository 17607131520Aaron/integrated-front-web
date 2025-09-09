import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import { rootReducer, whitelist } from './store';

// 创建存储引擎
const createNoopStorage = () => {
  return {
    getItem(): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: unknown): Promise<unknown> {
      return Promise.resolve(value);
    },
    removeItem(): Promise<void> {
      return Promise.resolve();
    },
  };
};

/**
 * 根据当前环境选择使用 sessionStorage 还是无操作存储
 * 如果在浏览器环境中，则使用 sessionStorage；否则使用无操作存储
 */
const webStorage =
  typeof window !== 'undefined' ? createWebStorage('session') : createNoopStorage();

// 配置持久化
const persistConfig = {
  key: 'integrated-front-vite-store',
  storage: webStorage,
  whitelist,
};

// 应用持久化配置到 rootReducer

const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * 使用 Redux Toolkit 配置 store
 * 优势:
 * - 内置 thunk 中间件
 * - 内置 Redux DevTools 扩展支持
 * - 内置不可变更新逻辑
 * - 更好的类型推导支持
 * - 自动处理常见类型问题
 */
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // 配置序列化检查，允许 redux-persist 的 action
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 创建持久化存储
const persist = persistStore(store);

// 导出 store 和类型
export { persist, store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
