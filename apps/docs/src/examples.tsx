import {useMemo, useState} from 'react';
import {Button, Input, Selector} from '@eforge/ui';
import {
  DataTable,
  EmptyDataState,
  ErrorState,
  FilterBar,
  LoadingState,
  SearchBar,
  useListQueryState,
  type ColumnDef,
} from '@eforge/data';
import {FormActions, FormSection} from '@eforge/forms';
import {PermissionGate, PermissionProvider} from '@eforge/patterns';

type DemoUser = {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Invited';
};

type DemoFilters = {
  role: string;
};

const demoUsers: DemoUser[] = [
  {id: '1', name: 'Alice Chen', role: 'Administrator', status: 'Active'},
  {id: '2', name: 'Nora Patel', role: 'Analyst', status: 'Invited'},
  {id: '3', name: 'Marco Ruiz', role: 'Editor', status: 'Active'},
  {id: '4', name: 'Sam Lee', role: 'Viewer', status: 'Active'},
  {id: '5', name: 'Ivy Wang', role: 'Analyst', status: 'Active'},
  {id: '6', name: 'Rina Zhao', role: 'Editor', status: 'Invited'},
];

const columns: ColumnDef<DemoUser>[] = [
  {accessorKey: 'name', header: 'Name'},
  {accessorKey: 'role', header: 'Role'},
  {accessorKey: 'status', header: 'Status'},
];

export function UiExamples() {
  const [name, setName] = useState('EForge');
  return (
    <div className="example-stack">
      <div className="example-row">
        <Button label="Primary action" variant="primary" />
        <Button label="Secondary action" variant="secondary" />
        <Button label="Quiet action" variant="ghost" />
      </div>
      <Input label="Organization name" value={name} onChange={setName} width="100%" />
    </div>
  );
}

export function DataExamples() {
  const query = useListQueryState<DemoFilters>({
    filters: {role: 'All roles'},
    pageSize: 3,
  });

  const filteredAndSorted = useMemo(() => {
    const normalized = query.state.search.trim().toLowerCase();
    const rows = demoUsers.filter(user => {
      const matchesSearch =
        !normalized ||
        `${user.name} ${user.role} ${user.status}`
          .toLowerCase()
          .includes(normalized);
      const matchesRole =
        query.state.filters.role === 'All roles' ||
        user.role === query.state.filters.role;
      return matchesSearch && matchesRole;
    });

    const sort = query.state.sorting[0];
    if (!sort) return rows;
    const key = sort.id as keyof DemoUser;
    return [...rows].sort((left, right) => {
      const result = String(left[key]).localeCompare(String(right[key]));
      return sort.desc ? -result : result;
    });
  }, [query.state.filters.role, query.state.search, query.state.sorting]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredAndSorted.length / query.state.pagination.pageSize),
  );
  const start =
    query.state.pagination.pageIndex * query.state.pagination.pageSize;
  const rows = filteredAndSorted.slice(
    start,
    start + query.state.pagination.pageSize,
  );
  const activeCount = Number(query.state.filters.role !== 'All roles');

  return (
    <div className="example-stack">
      <FilterBar
        search={
          <SearchBar
            label="Search example users"
            value={query.state.search}
            onChange={query.setSearch}
            placeholder="Search name, role or status"
            width="100%"
          />
        }
        activeCount={activeCount}
        onClear={() => query.setFilters({role: 'All roles'})}>
        <Selector
          label="Example role filter"
          options={['All roles', 'Administrator', 'Editor', 'Analyst', 'Viewer']}
          value={query.state.filters.role}
          onChange={value => query.setFilters({role: value ?? 'All roles'})}
          width={170}
        />
      </FilterBar>

      <DataTable
        data={rows}
        columns={columns}
        getRowId={row => row.id}
        getRowSelectionLabel={row => `Select ${row.name}`}
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
          <Button label={`Bulk action ${count}`} size="sm" variant="secondary" />
        )}
      />

      <div className="state-grid">
        <LoadingState label="Loading records" compact />
        <EmptyDataState title="No records yet" description="Create the first record when you are ready." />
        <ErrorState title="Could not load records" message="Retry after checking the connection." />
      </div>
    </div>
  );
}

export function FormExamples() {
  const [value, setValue] = useState('ap-southeast-1');
  return (
    <FormSection
      title="Workspace settings"
      description="Use sections to separate meaningful groups of fields.">
      <Input label="API region" value={value} onChange={setValue} width="100%" />
      <FormActions>
        <Button label="Cancel" variant="secondary" />
        <Button label="Save changes" variant="primary" />
      </FormActions>
    </FormSection>
  );
}

export function PermissionExamples() {
  return (
    <PermissionProvider permissions={['project:read']}>
      <div className="example-row">
        <PermissionGate permission="project:read">
          <Button label="Visible with project:read" variant="secondary" />
        </PermissionGate>
        <PermissionGate
          permission="project:delete"
          fallback={<span className="permission-fallback">Delete action hidden without permission</span>}>
          <Button label="Delete project" variant="secondary" />
        </PermissionGate>
      </div>
    </PermissionProvider>
  );
}
