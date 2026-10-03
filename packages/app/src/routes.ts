import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from '@eforge/core';

export interface AppRouteAccess {
  permission?: string;
  anyOf?: readonly string[];
  allOf?: readonly string[];
}

export interface AppRouteNavigation {
  label?: string;
  order?: number;
}

export interface AppRouteRecord {
  id: string;
  path: string;
  title: string;
  parentId?: string;
  access?: AppRouteAccess;
  navigation?: AppRouteNavigation;
}

export interface RouteMatch<T extends AppRouteRecord = AppRouteRecord> {
  route: T;
  params: Readonly<Record<string, string>>;
}

export interface NavigationEntry {
  id: string;
  path: string;
  label: string;
  order: number;
}

export interface BreadcrumbEntry {
  id: string;
  path: string;
  label: string;
}

function normalizePathname(pathname: string) {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (withLeadingSlash === '/') return '/';
  return withLeadingSlash.replace(/\/+$/, '') || '/';
}

function splitPath(pathname: string) {
  const normalized = normalizePathname(pathname);
  return normalized === '/' ? [] : normalized.slice(1).split('/');
}

function safeDecode(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function matchRoutePath(pattern: string, pathname: string) {
  const patternSegments = splitPath(pattern);
  const pathnameSegments = splitPath(pathname);
  const params: Record<string, string> = {};

  let pathIndex = 0;

  for (let patternIndex = 0; patternIndex < patternSegments.length; patternIndex += 1) {
    const patternSegment = patternSegments[patternIndex];
    if (patternSegment === undefined) return null;

    if (patternSegment === '*') {
      params['*'] = pathnameSegments.slice(pathIndex).map(safeDecode).join('/');
      return params;
    }

    const pathnameSegment = pathnameSegments[pathIndex];
    if (pathnameSegment === undefined) return null;

    if (patternSegment.startsWith(':')) {
      const paramName = patternSegment.slice(1);
      if (!paramName) return null;
      params[paramName] = safeDecode(pathnameSegment);
    } else if (patternSegment !== pathnameSegment) {
      return null;
    }

    pathIndex += 1;
  }

  return pathIndex === pathnameSegments.length ? params : null;
}

function routeSpecificity(path: string) {
  return splitPath(path).reduce((score, segment) => {
    if (segment === '*') return score - 1000;
    if (segment.startsWith(':')) return score + 10;
    return score + 100;
  }, splitPath(path).length);
}

export function matchAppRoute<T extends AppRouteRecord>(
  routes: readonly T[],
  pathname: string,
): RouteMatch<T> | null {
  let best: RouteMatch<T> | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const route of routes) {
    const params = matchRoutePath(route.path, pathname);
    if (!params) continue;

    const score = routeSpecificity(route.path);
    if (score > bestScore) {
      best = {route, params};
      bestScore = score;
    }
  }

  return best;
}

export function canAccessRules(
  access: AppRouteAccess | undefined,
  permissions: readonly string[],
) {
  if (!access) return true;
  if (access.permission && !hasPermission(permissions, access.permission)) return false;
  if (access.anyOf && !hasAnyPermission(permissions, access.anyOf)) return false;
  if (access.allOf && !hasAllPermissions(permissions, access.allOf)) return false;
  return true;
}

export function canAccessRoute(
  route: AppRouteRecord,
  permissions: readonly string[],
) {
  return canAccessRules(route.access, permissions);
}

export function buildNavigation(
  routes: readonly AppRouteRecord[],
  permissions: readonly string[],
): NavigationEntry[] {
  return routes
    .filter(route => route.navigation && canAccessRoute(route, permissions))
    .map(route => ({
      id: route.id,
      path: route.path,
      label: route.navigation?.label ?? route.title,
      order: route.navigation?.order ?? 0,
    }))
    .sort((left, right) => left.order - right.order || left.label.localeCompare(right.label));
}

function getRouteById(routes: readonly AppRouteRecord[], id: string) {
  return routes.find(route => route.id === id);
}

export function getRouteAncestry(
  routes: readonly AppRouteRecord[],
  routeId: string,
) {
  const chain: AppRouteRecord[] = [];
  const visited = new Set<string>();
  let current = getRouteById(routes, routeId);

  while (current) {
    if (visited.has(current.id)) {
      throw new Error(`EForge route parent cycle detected at "${current.id}".`);
    }
    visited.add(current.id);
    chain.unshift(current);
    current = current.parentId ? getRouteById(routes, current.parentId) : undefined;
  }

  return chain;
}

export function isRouteAncestor(
  routes: readonly AppRouteRecord[],
  ancestorId: string,
  routeId: string,
) {
  return getRouteAncestry(routes, routeId).some(route => route.id === ancestorId);
}

export function materializeRoutePath(
  pattern: string,
  params: Readonly<Record<string, string>>,
) {
  return normalizePathname(
    pattern
      .split('/')
      .map(segment => {
        if (!segment.startsWith(':')) return segment;
        const value = params[segment.slice(1)];
        return value === undefined ? segment : encodeURIComponent(value);
      })
      .join('/'),
  );
}

export function buildBreadcrumbs(
  routes: readonly AppRouteRecord[],
  routeId: string,
  params: Readonly<Record<string, string>> = {},
): BreadcrumbEntry[] {
  return getRouteAncestry(routes, routeId).map(route => ({
    id: route.id,
    path: materializeRoutePath(route.path, params),
    label: route.title,
  }));
}

export function validateRouteConfig(routes: readonly AppRouteRecord[]) {
  const ids = new Set<string>();
  const paths = new Set<string>();

  for (const route of routes) {
    if (!route.id.trim()) throw new Error('EForge route id cannot be empty.');
    if (!route.path.startsWith('/')) {
      throw new Error(`EForge route "${route.id}" must use an absolute path.`);
    }
    if (ids.has(route.id)) {
      throw new Error(`Duplicate EForge route id "${route.id}".`);
    }
    if (paths.has(route.path)) {
      throw new Error(`Duplicate EForge route path "${route.path}".`);
    }
    ids.add(route.id);
    paths.add(route.path);
  }

  for (const route of routes) {
    if (route.parentId && !ids.has(route.parentId)) {
      throw new Error(
        `EForge route "${route.id}" references missing parent "${route.parentId}".`,
      );
    }
    getRouteAncestry(routes, route.id);
  }
}
