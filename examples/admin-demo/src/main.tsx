import {StrictMode, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
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
  AppShell,
  DashboardPage,
  FormPage,
  ListPage,
  PermissionGate,
  PermissionProvider,
} from '@eforge/patterns';
import '@eforge/ui/styles.css';
import '@eforge/data/styles.css';
import '@eforge/patterns/styles.css';
import './styles.css';

type View = 'dashboard' | 'users' | 'settings';

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

function Navigation({view, setView}: {view: View; setView(view: View): void}) {
  return (
    <>
      <Button label="Dashboard" variant={view === 'dashboard' ? 'secondary' : 'ghost'} width="100%" onClick={() => setView('dashboard')} />
      <Button label="Users" variant={view === 'users' ? 'secondary' : 'ghost'} width="100%" onClick={() => setView('users')} />
      <Button label="Settings" variant={view === 'settings' ? 'secondary' : 'ghost'} width="100%" onClick={() => setView('settings')} />
    </>
  );
}

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
      description="Reference enterprise dashboard built only from EForge public APIs.">
      {metrics.map(([label, value, detail]) => (
        <article className="metric-card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
          <small>{detail}</small>
        </article>
      ))}
      <article className="activity-card">
        <h2>Foundation coverage</h2>
        <p>This demo validates page patterns, permissions, Astryx-backed UI, controlled list query state, server-style pagination, sorting, selection, and column visibility.</p>
      </article>
    </DashboardPage>
  );
}

function UsersPage() {
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
      description="Enterprise list infrastructure with query state, server-style pagination, sorting, selection, and column visibility."
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
        renderBulkActions={({count}) => (
          <Button label={`Archive ${count}`} size="sm" variant="secondary" />
        )}
      />
    </ListPage>
  );
}

function SettingsPage() {
  const [organization, setOrganization] = useState('EForge Labs');
  return (
    <FormPage
      title="Settings"
      description="A standard form page with stable spacing and content width."
      footer={<Button label="Save settings" variant="primary" />}>
      <Input label="Organization name" value={organization} onChange={setOrganization} width="100%" />
      <Input label="API region" value="ap-southeast-1" onChange={() => undefined} width="100%" isReadOnly />
    </FormPage>
  );
}

function AdminDemo() {
  const [view, setView] = useState<View>('dashboard');
  return (
    <PermissionProvider permissions={['user:read', 'user:create', 'settings:read']}>
      <AppShell
        brand={<span>EForge <small>Admin</small></span>}
        navigation={<Navigation view={view} setView={setView} />}
        header={<div className="user-chip" aria-label="Signed in user">JR · Admin</div>}>
        {view === 'dashboard' && <Dashboard />}
        {view === 'users' && <UsersPage />}
        {view === 'settings' && <SettingsPage />}
      </AppShell>
    </PermissionProvider>
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
