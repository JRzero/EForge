import {useMemo, useState} from 'react';
import {Button, Input} from '@eforge/ui';
import {
  DataTable,
  EmptyDataState,
  ErrorState,
  LoadingState,
  SearchBar,
  type ColumnDef,
} from '@eforge/data';
import {FormActions, FormSection} from '@eforge/forms';
import {PermissionGate, PermissionProvider} from '@eforge/patterns';

type DemoUser = {
  id: string;
  name: string;
  role: string;
};

const demoUsers: DemoUser[] = [
  {id: '1', name: 'Alice Chen', role: 'Administrator'},
  {id: '2', name: 'Nora Patel', role: 'Analyst'},
  {id: '3', name: 'Marco Ruiz', role: 'Editor'},
];

const columns: ColumnDef<DemoUser>[] = [
  {accessorKey: 'name', header: 'Name'},
  {accessorKey: 'role', header: 'Role'},
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
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? demoUsers.filter(user => `${user.name} ${user.role}`.toLowerCase().includes(normalized))
      : demoUsers;
  }, [query]);

  return (
    <div className="example-stack">
      <SearchBar
        label="Search example users"
        value={query}
        onChange={setQuery}
        placeholder="Search name or role"
        width="100%"
      />
      <DataTable data={filtered} columns={columns} pagination={false} getRowId={row => row.id} />
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
