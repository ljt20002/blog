import { Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { lazy } from 'react';
import ErrorFallback from '@/pages/ErrorFallback';

const Home = lazy(() => import('../pages/Home'));
const AboutMe = lazy(() => import('@/pages/AboutMe'));
const Detail = lazy(() => import('@/pages/Detail'));
const Test = lazy(() => import('@/pages/Test'));
const NotFound = lazy(() => import('../pages/NotFound'));

export interface AppRouteObject {
  path?: string;
  element?: React.ReactNode;
  children?: AppRouteObject[];
  title?: string;
  hideInMenu?: boolean;
  errorElement?: React.ReactNode;
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
    title: 'nav.home',
  },
  {
    path: '/about-me',
    element: <AboutMe />,
    title: 'nav.about',
  },
  // 兼容旧路径
  {
    path: '/AboutMe',
    element: <Navigate to="/about-me" replace />,
    hideInMenu: true,
  },
  {
    path: '/detail',
    element: <Detail />,
    title: 'nav.detail',
    hideInMenu: true,
  },
];

const routes: AppRouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorFallback />,
    children: contentRoutes,
  },
  {
    path: '/test',
    element: <Test />,
    title: 'nav.test',
  },
  {
    path: '*',
    title: 'nav.404',
    element: <NotFound />,
    hideInMenu: true,
  },
];

export default routes;
