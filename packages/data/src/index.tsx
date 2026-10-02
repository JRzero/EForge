import {useMemo, useState, type KeyboardEvent, type ReactNode} from 'react';
import {
  QueryClient,
  QueryClientProvider,
  type DefaultOptions,
} from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table';
import {Button, Input, Spinner} from '@eforge/ui';

export * from '@tanstack/react-query';
export type {ColumnDef} from '@tanstack/react-table';

export interface CreateEForgeQueryClientOptions {
  defaultOptions?: DefaultOptions;
}

export function createEForgeQueryClient(options: CreateEForgeQueryClientOptions = {}) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
        ...options.defaultOptions?.queries,
      },
      mutations: {
        ...options.defaultOptions?.mutations,
      },
    },
  });
}

export interface EForgeQueryProviderProps {
  children: ReactNode;
  client?: QueryClient;
}

export function EForgeQueryProvider({children, client}: EForgeQueryProviderProps) {
  const [internalClient] = useState(() => client ?? createEForgeQueryClient());
  return <QueryClientProvider client={internalClient}>{children}</QueryClientProvider>;
}

export interface SearchBarProps {
  value: string;
  onChange(value: string): void;
  label?: string;
  placeholder?: string;
  width?: number | string;
}

export function SearchBar({
  value,
  onChange,
  label = 'Search',
  placeholder = 'Search…',
  width = 320,
}: SearchBarProps) {
  return (
    <Input
      label={label}
      isLabelHidden
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      width={width}
      hasClear
    />
  );
}

export interface DataTableProps<TData> {
  data: readonly TData[];
  columns: ColumnDef<TData, any>[];
  loading?: boolean;
  emptyText?: string;
  pageSize?: number;
  pagination?: boolean;
  getRowId?: (row: TData, index: number, parent?: Row<TData>) => string;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({
  data,
  columns,
  loading = false,
  emptyText = 'No data',
  pageSize = 10,
  pagination = true,
  getRowId,
  onRowClick,
}: DataTableProps<TData>) {
  const tableData = useMemo(() => [...data], [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(pagination ? {getPaginationRowModel: getPaginationRowModel()} : {}),
    initialState: {pagination: {pageIndex: 0, pageSize}},
    ...(getRowId ? {getRowId} : {}),
  });

  const rows = table.getRowModel().rows;

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: TData) => {
    if (onRowClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <div className="ef-data-table" data-loading={loading || undefined}>
      <div className="ef-data-table__scroll">
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={Math.max(1, columns.length)}>
                  <LoadingState label="Loading data" compact />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={Math.max(1, columns.length)}>
                  <EmptyDataState title={emptyText} />
                </td>
              </tr>
            ) : (
              rows.map(row => (
                <tr
                  key={row.id}
                  data-clickable={Boolean(onRowClick) || undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  onKeyDown={event => handleRowKeyDown(event, row.original)}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && !loading && table.getPageCount() > 1 && (
        <div className="ef-data-table__pagination" aria-label="Table pagination">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="ef-data-table__pagination-actions">
            <Button
              label="Previous"
              size="sm"
              variant="secondary"
              isDisabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            />
            <Button
              label="Next"
              size="sm"
              variant="secondary"
              isDisabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export interface LoadingStateProps {
  label?: string;
  compact?: boolean;
}

export function LoadingState({label = 'Loading', compact = false}: LoadingStateProps) {
  return (
    <div className={`ef-data-state${compact ? ' ef-data-state--compact' : ''}`} role="status">
      <Spinner size="sm" />
      <span>{label}</span>
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({title = 'Something went wrong', message, onRetry}: ErrorStateProps) {
  return (
    <div className="ef-data-state" role="alert">
      <strong>{title}</strong>
      {message && <span>{message}</span>}
      {onRetry && <Button label="Retry" size="sm" onClick={onRetry} />}
    </div>
  );
}

export interface EmptyDataStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyDataState({
  title = 'Nothing here yet',
  description,
  action,
}: EmptyDataStateProps) {
  return (
    <div className="ef-data-state ef-data-state--empty">
      <strong>{title}</strong>
      {description && <span>{description}</span>}
      {action}
    </div>
  );
}
