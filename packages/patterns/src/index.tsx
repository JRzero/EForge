import {
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {hasAllPermissions, hasAnyPermission, hasPermission} from '@eforge/core';

export interface AppShellProps {
  brand: ReactNode;
  navigation: ReactNode;
  header?: ReactNode;
  children: ReactNode;
  sidebarWidth?: number;
}

export function AppShell({
  brand,
  navigation,
  header,
  children,
  sidebarWidth = 240,
}: AppShellProps) {
  return (
    <div className="ef-app-shell" style={{'--ef-sidebar-width': `${sidebarWidth}px`} as CSSProperties}>
      <aside className="ef-app-shell__sidebar">
        <div className="ef-app-shell__brand">{brand}</div>
        <nav className="ef-app-shell__nav" aria-label="Primary navigation">
          {navigation}
        </nav>
      </aside>
      <div className="ef-app-shell__main">
        {header && <header className="ef-app-shell__header">{header}</header>}
        <main className="ef-app-shell__content">{children}</main>
      </div>
    </div>
  );
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  meta?: ReactNode;
}

export function PageHeader({title, description, eyebrow, actions, meta}: PageHeaderProps) {
  return (
    <header className="ef-page-header">
      <div className="ef-page-header__copy">
        {eyebrow && <span className="ef-page-header__eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {meta && <div className="ef-page-header__meta">{meta}</div>}
      </div>
      {actions && <div className="ef-page-header__actions">{actions}</div>}
    </header>
  );
}

export interface ListPageProps extends PageHeaderProps {
  filters?: ReactNode;
  children: ReactNode;
}

export function ListPage({filters, children, ...header}: ListPageProps) {
  return (
    <section className="ef-page ef-list-page">
      <PageHeader {...header} />
      {filters && <div className="ef-list-page__filters">{filters}</div>}
      <div className="ef-page__body">{children}</div>
    </section>
  );
}

export interface DetailPageProps extends PageHeaderProps {
  sidebar?: ReactNode;
  children: ReactNode;
}

export function DetailPage({sidebar, children, ...header}: DetailPageProps) {
  return (
    <section className="ef-page ef-detail-page">
      <PageHeader {...header} />
      <div className={sidebar ? 'ef-detail-page__grid' : 'ef-page__body'}>
        <div>{children}</div>
        {sidebar && <aside className="ef-detail-page__sidebar">{sidebar}</aside>}
      </div>
    </section>
  );
}

export interface FormPageProps extends PageHeaderProps {
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: number;
}

export function FormPage({children, footer, maxWidth = 760, ...header}: FormPageProps) {
  return (
    <section className="ef-page ef-form-page">
      <PageHeader {...header} />
      <div className="ef-form-page__body" style={{maxWidth}}>
        {children}
        {footer && <div className="ef-form-page__footer">{footer}</div>}
      </div>
    </section>
  );
}

export interface DashboardPageProps extends PageHeaderProps {
  children: ReactNode;
}

export function DashboardPage({children, ...header}: DashboardPageProps) {
  return (
    <section className="ef-page ef-dashboard-page">
      <PageHeader {...header} />
      <div className="ef-dashboard-page__grid">{children}</div>
    </section>
  );
}

export interface WorkbenchPageProps extends PageHeaderProps {
  left?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}

export function WorkbenchPage({left, right, children, ...header}: WorkbenchPageProps) {
  return (
    <section className="ef-page ef-workbench-page">
      <PageHeader {...header} />
      <div className="ef-workbench-page__grid">
        {left && <aside className="ef-workbench-page__side">{left}</aside>}
        <div className="ef-workbench-page__main">{children}</div>
        {right && <aside className="ef-workbench-page__side">{right}</aside>}
      </div>
    </section>
  );
}

const PermissionContext = createContext<readonly string[]>([]);

export interface PermissionProviderProps {
  permissions: readonly string[];
  children: ReactNode;
}

export function PermissionProvider({permissions, children}: PermissionProviderProps) {
  return <PermissionContext.Provider value={permissions}>{children}</PermissionContext.Provider>;
}

export interface PermissionGateProps {
  permission?: string;
  anyOf?: readonly string[];
  allOf?: readonly string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({
  permission,
  anyOf,
  allOf,
  fallback = null,
  children,
}: PermissionGateProps) {
  const permissions = useContext(PermissionContext);
  const allowed = permission
    ? hasPermission(permissions, permission)
    : anyOf
      ? hasAnyPermission(permissions, anyOf)
      : allOf
        ? hasAllPermissions(permissions, allOf)
        : true;

  return allowed ? children : fallback;
}

export function usePermissions() {
  return useContext(PermissionContext);
}
