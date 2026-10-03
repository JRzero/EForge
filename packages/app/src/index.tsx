import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ComponentType,
  type MouseEvent,
  type ReactNode,
} from 'react';
import {
  AppShell,
  PermissionProvider,
  usePermissions,
} from '@eforge/patterns';
import {
  buildBreadcrumbs,
  buildNavigation,
  canAccessRules,
  canAccessRoute,
  isRouteAncestor,
  matchAppRoute,
  validateRouteConfig,
  type AppRouteAccess,
  type AppRouteRecord,
} from './routes';
import {
  createBrowserRouterAdapter,
  createMemoryRouterAdapter,
  type AppRouterAdapter,
} from './router';

export * from './routes';
export * from './router';

export interface AppRoutePageProps {
  params: Readonly<Record<string, string>>;
}

export interface AppRoute extends AppRouteRecord {
  component: ComponentType<AppRoutePageProps>;
}

export interface AppLocation {
  href: string;
  pathname: string;
  search: string;
  hash: string;
}

export interface AppRuntimeContextValue {
  location: AppLocation;
  route: AppRoute | null;
  params: Readonly<Record<string, string>>;
  navigate(to: string, options?: {replace?: boolean}): void;
}

const AppRuntimeContext = createContext<AppRuntimeContextValue | null>(null);

export function defineAppRoutes<const T extends readonly AppRoute[]>(routes: T): T {
  validateRouteConfig(routes);
  return routes;
}

function parseHref(href: string): AppLocation {
  const url = new URL(href, 'http://eforge.local');
  return {
    href: `${url.pathname}${url.search}${url.hash}`,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
  };
}

export function useAppRuntime() {
  const context = useContext(AppRuntimeContext);
  if (!context) {
    throw new Error('useAppRuntime must be used inside EForgeApplication.');
  }
  return context;
}

export interface AppLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  current?: boolean;
}

export function AppLink({to, children, className, current = false}: AppLinkProps) {
  const {navigate} = useAppRuntime();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(to);
  };

  return (
    <a
      href={to}
      className={className}
      aria-current={current ? 'page' : undefined}
      onClick={handleClick}>
      {children}
    </a>
  );
}

export interface RouteGuardProps {
  access?: AppRouteAccess;
  fallback?: ReactNode;
  children: ReactNode;
}

export function RouteGuard({
  access,
  fallback = <div role="alert">Access denied</div>,
  children,
}: RouteGuardProps) {
  const permissions = usePermissions();
  return canAccessRules(access, permissions) ? children : fallback;
}

function RuntimeNavigation({
  routes,
  permissions,
  currentRoute,
}: {
  routes: readonly AppRoute[];
  permissions: readonly string[];
  currentRoute: AppRoute | null;
}) {
  const entries = buildNavigation(routes, permissions);

  return (
    <ul className="ef-app-nav">
      {entries.map(entry => {
        const current = currentRoute
          ? isRouteAncestor(routes, entry.id, currentRoute.id)
          : false;
        return (
          <li key={entry.id}>
            <AppLink
              to={entry.path}
              current={current}
              className="ef-app-nav__link">
              {entry.label}
            </AppLink>
          </li>
        );
      })}
    </ul>
  );
}

function RuntimeBreadcrumbs({
  routes,
  route,
  params,
}: {
  routes: readonly AppRoute[];
  route: AppRoute;
  params: Readonly<Record<string, string>>;
}) {
  const items = buildBreadcrumbs(routes, route.id, params);
  if (items.length <= 1) return null;

  return (
    <nav className="ef-app-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={item.id}>
              {current ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <AppLink to={item.path}>{item.label}</AppLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export interface RuntimeStatePageProps {
  code: '403' | '404';
  title: string;
  description: string;
  homePath: string;
}

export function RuntimeStatePage({
  code,
  title,
  description,
  homePath,
}: RuntimeStatePageProps) {
  return (
    <section className="ef-runtime-state">
      <span className="ef-runtime-state__code">{code}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <AppLink to={homePath} className="ef-runtime-state__link">
        Back to home
      </AppLink>
    </section>
  );
}

export interface EForgeApplicationProps {
  routes: readonly AppRoute[];
  permissions: readonly string[];
  brand: ReactNode;
  header?: ReactNode;
  router?: AppRouterAdapter;
  homePath?: string;
  sidebarWidth?: number;
  forbidden?: ReactNode;
  notFound?: ReactNode;
}

export function EForgeApplication({
  routes,
  permissions,
  brand,
  header,
  router,
  homePath = '/',
  sidebarWidth,
  forbidden,
  notFound,
}: EForgeApplicationProps) {
  const validatedRoutes = useMemo(() => {
    validateRouteConfig(routes);
    return routes;
  }, [routes]);

  const fallbackRouterRef = useRef<AppRouterAdapter | null>(null);
  if (!fallbackRouterRef.current) {
    fallbackRouterRef.current =
      typeof window === 'undefined'
        ? createMemoryRouterAdapter(homePath)
        : createBrowserRouterAdapter(window);
  }
  const activeRouter = router ?? fallbackRouterRef.current;

  const href = useSyncExternalStore(
    activeRouter.subscribe,
    activeRouter.getCurrentHref,
    activeRouter.getCurrentHref,
  );
  const location = useMemo(() => parseHref(href), [href]);
  const match = useMemo(
    () => matchAppRoute(validatedRoutes, location.pathname),
    [location.pathname, validatedRoutes],
  );

  const navigate = useCallback(
    (to: string, options?: {replace?: boolean}) => {
      activeRouter.navigate(to, options);
    },
    [activeRouter],
  );

  const currentRoute = match?.route ?? null;
  const params = match?.params ?? {};
  const allowed =
    currentRoute === null || canAccessRoute(currentRoute, permissions);

  const context = useMemo<AppRuntimeContextValue>(
    () => ({
      location,
      route: currentRoute,
      params,
      navigate,
    }),
    [currentRoute, location, navigate, params],
  );

  let content: ReactNode;
  if (!currentRoute) {
    content =
      notFound ?? (
        <RuntimeStatePage
          code="404"
          title="Page not found"
          description="The requested page does not exist in this application."
          homePath={homePath}
        />
      );
  } else if (!allowed) {
    content =
      forbidden ?? (
        <RuntimeStatePage
          code="403"
          title="Access denied"
          description="You do not have permission to open this page."
          homePath={homePath}
        />
      );
  } else {
    const Page = currentRoute.component;
    content = (
      <>
        <RuntimeBreadcrumbs
          routes={validatedRoutes}
          route={currentRoute}
          params={params}
        />
        <Page params={params} />
      </>
    );
  }

  const shellProps =
    sidebarWidth === undefined ? {} : {sidebarWidth};

  return (
    <PermissionProvider permissions={permissions}>
      <AppRuntimeContext.Provider value={context}>
        <AppShell
          {...shellProps}
          brand={brand}
          navigation={
            <RuntimeNavigation
              routes={validatedRoutes}
              permissions={permissions}
              currentRoute={currentRoute}
            />
          }
          header={header}>
          {content}
        </AppShell>
      </AppRuntimeContext.Provider>
    </PermissionProvider>
  );
}
