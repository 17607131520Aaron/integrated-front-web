import { ConfigProvider } from 'antd';
import ZhCN from 'antd/locale/zh_CN';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import routers from './router';
import { persist, store } from './store';
import './styles/index.scss';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persist}>
      <ConfigProvider locale={ZhCN}>
        <Suspense fallback={<div>...加载中</div>}>
          <RouterProvider router={routers} />
        </Suspense>
      </ConfigProvider>
    </PersistGate>
  </Provider>,
);
