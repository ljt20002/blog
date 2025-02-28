import { Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import NotFound from '../pages/NotFound';
import { lazy } from 'react';
import Detail from '@/pages/Detail';
import AboutMe from '@/pages/AboutMe';
const Home = lazy(() => import('../pages/Home'));

export interface AppRouteObject {
  path?: string;
  element?: React.ReactNode;
  children?: AppRouteObject[];
  title?: string;
  hideInMenu?: boolean;
}

export const contentRoutes: AppRouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/home" replace />,
    hideInMenu: true,
  },
  {
    path: '/home',
    element: <Home />,
    title: '首页',
  },
  {
    path: '/AboutMe',
    element: <AboutMe />,
    title: '关于我',
  },
  {
    path: '/detail',
    element: <Detail />,
    title: 'Detail',
    hideInMenu: true,
  },
];

const routes: AppRouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: contentRoutes,
  },
  {
    path: '*',
    title: '404',
    element: <NotFound />,
    hideInMenu: true,
  },
];

export default routes;
