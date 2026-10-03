import {StrictMode, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  AppLink,
  EForgeApplication,
  defineAppRoutes,
  useAppRuntime,
  type AppRoutePageProps,
} from '@eforge/app';
import {Button, EForgeProvider, Input, Selector} from '@eforge/ui';
import {
  DataTable,
  EForgeQueryProvider,
  FilterBar,
  SearchBar,
  useListQueryState,
  type ColumnDef,
} from '@eforge/data';
import {
  DashboardPage,
  DetailPage,
  FormPage,
  ListPage,
  PermissionGate,
} from '@eforge/patterns';
import '@eforge/ui/styles.css';
import '@eforge/data/styles.css';
import '@eforge/patterns/styles.css';
import '@eforge/app/styles.css';
import './styles.css';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Invited';
};

type UserFilters = {
  role: string;
  status: string;
};

const users: User[] = [
  {id: 'u1', name: 'Alice Chen', email: 'alice@example.com', role: 'Administrator', status: 'Active'},
  {id: 'u2', name: 'Marco Ruiz', email: 'marco@example.com', role: 'Editor', status: 'Active'},
  {id: 'u3', name: 'Nora Patel', email: 'nora@example.com', role: 'Analyst', status: 'Invited'},
  {id: 'u4', name: 'Sam Lee', email: 'sam@example.com', role: 'Viewer', status: 'Active'},
  {id: 'u5', name: 'Mina Park', email: 'mina@example.com', role: 'Editor', status: 'Active'},
  {id: 'u6', name: 'Owen Smith', email: 'owen@example.com', role: 'Viewer', status: 'Invited'},
  {id: 'u7', name: 'Ivy Wang', email: 'ivy@example.com', role: 'Analyst', status: 'Active'},
  {id: 'u8', name: 'Leo Martin', email: 'leo@example.com', role: 'Editor', status: 'Active'},
  {id: 'u9', name: 'Sara Kim', email: 'sara@example.com', role: 'Viewer', status: 'Active'},
  {id: 'u10', name: 'Jon Bell', email: 'jon@example.com', role: 'Analyst', status: 'Active'},
  {id: 'u11', name: 'Rina Zhao', email: 'rina@example.com', role: 'Editor', status: 'Invited'},
];

const columns: ColumnDef<User>[] = [
  {accessorKey: 'name', header: 'Name'},
  {accessorKey: 'email', header: 'Email'},
  {accessorKey: 'role', header: 'Role'},
  {
    accessorKey: 'status',
    header: 'Status',
    cell: info => <span className={`status status--${String(info.getValue()).toLowerCase()}`}>{String(info.getValue())}</span>,
  },
];

function Dashboard() {
  const metrics = [
    ['Active users', '128', '+12 this month'],
    ['Open tasks', '34', '9 due today'],
    ['API health', '99.98%', 'Last 30 days'],
    ['Feature flags', '6', '2 staged'],
  ] as const;

  return (
    <DashboardPage
      title="Dashboard"
      description="Reference enterprise dashboard bootstrapped by EForge application runtime.">
      {metrics.map(([label, value, detail]) => (
        <article className="metric-card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
          <small>{detail}</small>
        </article>
      ))}
      <article className="activity-card">
        <h2>Foundation coverage</h2>
        <p>Navigation, route metadata, permissions, breadcrumbs, list infrastructure, Astryx-backed UI, and browser history are all driven through EForge public APIs.</p>
      </article>
    </DashboardPage>
  );
}

function UsersPage() {
  const {navigate} = useAppRuntime();
  const query = useListQueryState<UserFilters>({
    filters: {role: 'All roles', status: 'All statuses'},
    pageSize: 5,
  });

  const filteredAndSorted = useMemo(() => {
    const normalized = query.state.search.trim().toLowerCase();
    const rows = users.filter(user => {
      const matchesSearch =
        !normalized ||
        `${user.name} ${user.email} ${user.role} ${user.status}`
          .toLowerCase()
          .includes(normalized);
      const matchesRole =
        query.state.filters.role === 'All roles' ||
        user.role === query.state.filters.role;
      const matchesStatus =
        query.state.filters.status === 'All statuses' ||
        user.status === query.state.filters.status;
      return matchesSearch && matchesRole && matchesStatus;
    });

    const sort = query.state.sorting[0];
    if (!sort) return rows;

    const key = sort.id as keyof User;
    return [...rows].sort((left, right) => {
      const result = String(left[key]).localeCompare(String(right[key]));
      return sort.desc ? -result : result;
    });
  }, [query.state.filters, query.state.search, query.state.sorting]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredAndSorted.length / query.state.pagination.pageSize),
  );
  const start =
    query.state.pagination.pageIndex * query.state.pagination.pageSize;
  const pageRows = filteredAndSorted.slice(
    start,
    start + query.state.pagination.pageSize,
  );

  const activeFilterCount =
    Number(query.state.filters.role !== 'All roles') +
    Number(query.state.filters.status !== 'All statuses');

  return (
    <ListPage
      title="Users"
      description="Enterprise list infrastructure inside the EForge application runtime."
      actions={
        <PermissionGate permission="user:create">
          <Button label="New user" variant="primary" />
        </PermissionGate>
      }
      filters={
        <FilterBar
          search={
            <SearchBar
              label="Search users"
              value={query.state.search}
              onChange={query.setSearch}
              placeholder="Search name, email, role or status"
              width="100%"
            />
          }
          activeCount={activeFilterCount}
          onClear={() =>
            query.setFilters({role: 'All roles', status: 'All statuses'})
          }>
          <Selector
            label="Role filter"
            options={['All roles', 'Administrator', 'Editor', 'Analyst', 'Viewer']}
            value={query.state.filters.role}
            onChange={value =>
              query.setFilters({
                ...query.state.filters,
                role: value ?? 'All roles',
              })
            }
            width={160}
          />
          <Selector
            label="Status filter"
            options={['All statuses', 'Active', 'Invited']}
            value={query.state.filters.status}
            onChange={value =>
              query.setFilters({
                ...query.state.filters,
                status: value ?? 'All statuses',
              })
            }
            width={150}
          />
        </FilterBar>
      }>
      <DataTable
        data={pageRows}
        columns={columns}
        getRowId={row => row.id}
        getRowSelectionLabel={row => `Select ${row.name}`}
        emptyText="No users match this query"
        paginationState={query.state.pagination}
        onPaginationChange={query.setPagination}
        manualPagination
        pageCount={pageCount}
        sortable
        sorting={query.state.sorting}
        onSortingChange={query.setSorting}
        manualSorting
        selectable
        showColumnVisibility
        onRowClick={row => navigate(`/users/${row.id}`)}
        renderBulkActions={({count}) => (
          <Button label={`Archive ${count}`} size="sm" variant="secondary" />
        )}
      />
    </ListPage>
  );
}

function UserDetailPage({params}: AppRoutePageProps) {
  const user = users.find(candidate => candidate.id === params.id);

  if (!user) {
    return (
      <DetailPage
        title="User not found"
        description="The user id exists in the route but not in this demo dataset.">
        <AppLink to="/users">Back to users</AppLink>
      </DetailPage>
    );
  }

  return (
    <DetailPage
      title={user.name}
      description="Dynamic route matched by /users/:id."
      sidebar={
        <div className="detail-meta">
          <strong>Status</strong>
          <span>{user.status}</span>
        </div>
      }>
      <div className="detail-grid">
        <div><strong>Email</strong><span>{user.email}</span></div>
        <div><strong>Role</strong><span>{user.role}</span></div>
      </div>
    </DetailPage>
  );
}

function SettingsPage() {
  const [organization, setOrganization] = useState('EForge Labs');
  return (
    <FormPage
      title="Settings"
      description="A standard form page reached through generated application navigation."
      footer={<Button label="Save settings" variant="primary" />}>
      <Input label="Organization name" value={organization} onChange={setOrganization} width="100%" />
      <Input label="API region" value="ap-southeast-1" onChange={() => undefined} width="100%" isReadOnly />
    </FormPage>
  );
}

function AuditPage() {
  return (
    <ListPage
      title="Audit log"
      description="This route is protected by audit:read and should not render for the demo user.">
      <p>Protected content</p>
    </ListPage>
  );
}

const routes = defineAppRoutes([
  {
    id: 'dashboard',
    path: '/',
    title: 'Dashboard',
    navigation: {label: 'Dashboard', order: 0},
    component: Dashboard,
  },
  {
    id: 'users',
    path: '/users',
    title: 'Users',
    navigation: {label: 'Users', order: 1},
    access: {permission: 'user:read'},
    component: UsersPage,
  },
  {
    id: 'user-detail',
    path: '/users/:id',
    title: 'User detail',
    parentId: 'users',
    access: {permission: 'user:read'},
    component: UserDetailPage,
  },
  {
    id: 'settings',
    path: '/settings',
    title: 'Settings',
    navigation: {label: 'Settings', order: 2},
    access: {permission: 'settings:read'},
    component: SettingsPage,
  },
  {
    id: 'audit',
    path: '/audit',
    title: 'Audit',
    navigation: {label: 'Audit', order: 3},
    access: {permission: 'audit:read'},
    component: AuditPage,
  },
] as const);

function AdminDemo() {
  return (
    <EForgeApplication
      routes={routes}
      permissions={['user:read', 'user:create', 'settings:read']}
      brand={<span>EForge <small>Admin</small></span>}
      header={<div className="user-chip" aria-label="Signed in user">JR · Admin</div>}
    />
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EForgeProvider>
      <EForgeQueryProvider>
        <AdminDemo />
      </EForgeQueryProvider>
    </EForgeProvider>
  </StrictMode>,
);
