/* eslint-disable unicorn/filename-case */
// eslint-disable-next-line unicorn/filename-case
import { Route } from 'react-router-dom';
import { AppRouteObject } from '.';
import { Suspense } from 'react';
import Loading from '@/components/Loading';

export const createRoute = (routes: AppRouteObject[]) => {
  // 确保 routes 是有效的数组
  if (!Array.isArray(routes)) {
    return null;
  }

  return (
    <Suspense fallback={<Loading />}>
      {routes.map((route) => {
        // 确保每个路由对象都有必要的属性
        if (typeof route.path === 'undefined') {
          return null;
        }

        return (
          <Route key={route.path || crypto.randomUUID()} path={route.path} element={route.element}>
            {/* 递归创建子路由，确保 children 存在且是数组 */}
            {Array.isArray(route.children) && route.children.length > 0 ? createRoute(route.children) : null}
          </Route>
        );
      })}
    </Suspense>
  );
};
