import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const LayoutHome = lazy(() => import('@/Layout'));
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/Login'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const isUserAuthenticated = () => {
  return null;
};

const routers = createBrowserRouter([
  {
    path: '/',
    element: <LayoutHome />,
    loader: isUserAuthenticated,
    children: [
      {
        path: '/',
        element: <Home />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default routers;
