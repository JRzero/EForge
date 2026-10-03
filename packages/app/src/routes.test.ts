import {describe, expect, it} from 'vitest';
import {
  buildBreadcrumbs,
  buildNavigation,
  canAccessRoute,
  matchAppRoute,
  matchRoutePath,
  validateRouteConfig,
  type AppRouteRecord,
} from './routes';

const routes: AppRouteRecord[] = [
  {id: 'home', path: '/', title: 'Home', navigation: {order: 0}},
  {id: 'users', path: '/users', title: 'Users', navigation: {order: 1}},
  {
    id: 'user-detail',
    path: '/users/:id',
    title: 'User detail',
    parentId: 'users',
  },
  {
    id: 'audit',
    path: '/audit',
    title: 'Audit',
    access: {permission: 'audit:read'},
    navigation: {order: 2},
  },
  {id: 'fallback', path: '/*', title: 'Fallback'},
];

describe('application routes', () => {
  it('matches static, parameter, and wildcard routes by specificity', () => {
    expect(matchRoutePath('/users/:id', '/users/u%201')).toEqual({id: 'u 1'});
    expect(matchAppRoute(routes, '/users/u1')).toMatchObject({
      route: {id: 'user-detail'},
      params: {id: 'u1'},
    });
    expect(matchAppRoute(routes, '/missing/path')?.route.id).toBe('fallback');
  });

  it('filters navigation by permissions', () => {
    expect(buildNavigation(routes, []).map(entry => entry.id)).toEqual([
      'home',
      'users',
    ]);
    expect(buildNavigation(routes, ['audit:read']).map(entry => entry.id)).toEqual([
      'home',
      'users',
      'audit',
    ]);
    expect(canAccessRoute(routes[3]!, [])).toBe(false);
  });

  it('builds parent breadcrumbs for detail routes', () => {
    expect(buildBreadcrumbs(routes, 'user-detail', {id: 'u1'})).toEqual([
      {id: 'users', path: '/users', label: 'Users'},
      {id: 'user-detail', path: '/users/u1', label: 'User detail'},
    ]);
  });

  it('rejects invalid parent references and cycles', () => {
    expect(() =>
      validateRouteConfig([
        {id: 'child', path: '/child', title: 'Child', parentId: 'missing'},
      ]),
    ).toThrow(/missing parent/);

    expect(() =>
      validateRouteConfig([
        {id: 'a', path: '/a', title: 'A', parentId: 'b'},
        {id: 'b', path: '/b', title: 'B', parentId: 'a'},
      ]),
    ).toThrow(/cycle/);
  });
});
