import {
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  QueryClient,
  QueryClientProvider,
  type DefaultOptions,
} from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table as TableInstance,
  type VisibilityState,
} from '@tanstack/react-table';
import {Button, Checkbox, Input, Popover, Spinner} from '@eforge/ui';

export * from '@tanstack/react-query';
export * from './query-state';
export type {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

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

export interface FilterBarProps {
  search?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  activeCount?: number;
  onClear?: () => void;
  clearLabel?: string;
  label?: string;
}

export function FilterBar({
  search,
  children,
  actions,
  activeCount = 0,
  onClear,
  clearLabel = 'Clear filters',
  label = 'List filters',
}: FilterBarProps) {
  return (
    <div className="ef-filter-bar" role="group" aria-label={label}>
      {search && <div className="ef-filter-bar__search">{search}</div>}
      {children && <div className="ef-filter-bar__fields">{children}</div>}
      <div className="ef-filter-bar__actions">
        {activeCount > 0 && (
          <span className="ef-filter-bar__count" aria-label={`${activeCount} active filters`}>
            {activeCount} active
          </span>
        )}
        {onClear && activeCount > 0 && (
          <Button label={clearLabel} size="sm" variant="ghost" onClick={onClear} />
        )}
        {actions}
      </div>
    </div>
  );
}

function useOptionalControlledState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: OnChangeFn<T>,
) {
  const [internal, setInternal] = useState<T>(() => defaultValue);
  const state = value ?? internal;

  const handleChange = useCallback<OnChangeFn<T>>(
    updater => {
      if (value === undefined) {
        setInternal(updater);
      }
      onChange?.(updater);
    },
    [onChange, value],
  );

  return [state, handleChange] as const;
}

function getColumnLabel<TData>(column: Column<TData, unknown>) {
  const header = column.columnDef.header;
  return typeof header === 'string' ? header : column.id;
}

function ColumnVisibilityControl<TData>({table}: {table: TableInstance<TData>}) {
  const columns = table
    .getAllLeafColumns()
    .filter(column => column.id !== '__select' && column.getCanHide());

  if (columns.length === 0) return null;

  return (
    <Popover
      label="Choose visible columns"
      placement="below"
      alignment="end"
      width={240}
      content={
        <div className="ef-column-visibility">
          <strong>Visible columns</strong>
          {columns.map(column => (
            <Checkbox
              key={column.id}
              label={getColumnLabel(column)}
              value={column.getIsVisible()}
              onChange={checked => column.toggleVisibility(checked)}
            />
          ))}
        </div>
      }>
      <Button label="Columns" size="sm" variant="secondary" />
    </Popover>
  );
}

export interface BulkSelectionContext<TData> {
  count: number;
  selectedRowIds: readonly string[];
  selectedRows: readonly TData[];
  clearSelection(): void;
}

export interface DataTableProps<TData> {
  data: readonly TData[];
  columns: ColumnDef<TData, any>[];
  loading?: boolean;
  emptyText?: string;
  pageSize?: number;
  pagination?: boolean;
  paginationState?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  manualPagination?: boolean;
  pageCount?: number;
  sortable?: boolean;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  manualSorting?: boolean;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  showColumnVisibility?: boolean;
  selectable?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  renderBulkActions?: (context: BulkSelectionContext<TData>) => ReactNode;
  getRowSelectionLabel?: (row: TData, index: number) => string;
  getRowId?: (row: TData, index: number, parent?: Row<TData>) => string;
  onRowClick?: (row: TData) => void;
}

function defaultRowSelectionLabel<TData>(_row: TData, index: number) {
  return `Select row ${index + 1}`;
}

export function DataTable<TData>({
  data,
  columns,
  loading = false,
  emptyText = 'No data',
  pageSize = 10,
  pagination = true,
  paginationState,
  onPaginationChange,
  manualPagination = false,
  pageCount,
  sortable = false,
  sorting,
  onSortingChange,
  manualSorting = false,
  columnVisibility,
  onColumnVisibilityChange,
  showColumnVisibility = false,
  selectable = false,
  rowSelection,
  onRowSelectionChange,
  renderBulkActions,
  getRowSelectionLabel = defaultRowSelectionLabel,
  getRowId,
  onRowClick,
}: DataTableProps<TData>) {
  const tableData = useMemo(() => [...data], [data]);

  const [resolvedPagination, setResolvedPagination] = useOptionalControlledState(
    paginationState,
    {pageIndex: 0, pageSize},
    onPaginationChange,
  );
  const [resolvedSorting, setResolvedSorting] = useOptionalControlledState<SortingState>(
    sorting,
    [],
    onSortingChange,
  );
  const [resolvedVisibility, setResolvedVisibility] =
    useOptionalControlledState<VisibilityState>(
      columnVisibility,
      {},
      onColumnVisibilityChange,
    );
  const [resolvedSelection, setResolvedSelection] =
    useOptionalControlledState<RowSelectionState>(
      rowSelection,
      {},
      onRowSelectionChange,
    );

  const selectionColumn = useMemo<ColumnDef<TData, any>>(
    () => ({
      id: '__select',
      enableSorting: false,
      enableHiding: false,
      header: ({table}) => {
        const value = table.getIsAllPageRowsSelected()
          ? true
          : table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : false;
        return (
          <div className="ef-data-table__selection-control">
            <Checkbox
              label="Select all rows on this page"
              isLabelHidden
              value={value}
              onChange={checked => table.toggleAllPageRowsSelected(checked)}
              size="sm"
            />
          </div>
        );
      },
      cell: ({row}) => (
        <div
          className="ef-data-table__selection-control"
          onClick={event => event.stopPropagation()}
          onKeyDown={event => event.stopPropagation()}>
          <Checkbox
            label={getRowSelectionLabel(row.original, row.index)}
            isLabelHidden
            value={row.getIsSelected()}
            isDisabled={!row.getCanSelect()}
            onChange={checked => row.toggleSelected(checked)}
            size="sm"
          />
        </div>
      ),
    }),
    [getRowSelectionLabel],
  );

  const tableColumns = useMemo(
    () => (selectable ? [selectionColumn, ...columns] : columns),
    [columns, selectable, selectionColumn],
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    state: {
      pagination: resolvedPagination,
      sorting: resolvedSorting,
      columnVisibility: resolvedVisibility,
      rowSelection: resolvedSelection,
    },
    onPaginationChange: setResolvedPagination,
    onSortingChange: setResolvedSorting,
    onColumnVisibilityChange: setResolvedVisibility,
    onRowSelectionChange: setResolvedSelection,
    enableSorting: sortable,
    enableRowSelection: selectable,
    getCoreRowModel: getCoreRowModel(),
    ...(pagination && !manualPagination
      ? {getPaginationRowModel: getPaginationRowModel()}
      : {}),
    ...(sortable && !manualSorting
      ? {getSortedRowModel: getSortedRowModel()}
      : {}),
    ...(manualPagination ? {manualPagination: true} : {}),
    ...(manualSorting ? {manualSorting: true} : {}),
    ...(pageCount !== undefined ? {pageCount} : {}),
    ...(getRowId ? {getRowId} : {}),
  });

  const rows = table.getRowModel().rows;
  const selectedRowIds = Object.entries(resolvedSelection)
    .filter(([, selected]) => selected)
    .map(([id]) => id);
  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
  const selectedCount = selectedRowIds.length;

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: TData) => {
    if (onRowClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onRowClick(row);
    }
  };

  const resolvedPageCount = table.getPageCount();
  const hasKnownPageCount = resolvedPageCount >= 0;
  const showPagination =
    pagination &&
    !loading &&
    (hasKnownPageCount
      ? resolvedPageCount > 1
      : table.getCanPreviousPage() || table.getCanNextPage());

  return (
    <div className="ef-data-table" data-loading={loading || undefined}>
      {(showColumnVisibility || selectedCount > 0) && (
        <div className="ef-data-table__toolbar">
          <div className="ef-data-table__selection-summary">
            {selectedCount > 0 && (
              <>
                <strong>{selectedCount} selected</strong>
                {renderBulkActions?.({
                  count: selectedCount,
                  selectedRowIds,
                  selectedRows,
                  clearSelection: () => table.resetRowSelection(),
                })}
                <Button
                  label="Clear selection"
                  size="sm"
                  variant="ghost"
                  onClick={() => table.resetRowSelection()}
                />
              </>
            )}
          </div>
          {showColumnVisibility && <ColumnVisibilityControl table={table} />}
        </div>
      )}

      <div className="ef-data-table__scroll">
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const sorted = header.column.getIsSorted();
                  const ariaSort =
                    sorted === 'asc'
                      ? 'ascending'
                      : sorted === 'desc'
                        ? 'descending'
                        : 'none';

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      aria-sort={
                        sortable && header.column.getCanSort() ? ariaSort : undefined
                      }>
                      {header.isPlaceholder ? null : sortable && header.column.getCanSort() ? (
                        <button
                          type="button"
                          className="ef-data-table__sort"
                          onClick={header.column.getToggleSortingHandler()}>
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                          <span className="ef-data-table__sort-indicator" aria-hidden="true">
                            {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
                          </span>
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={Math.max(1, table.getVisibleLeafColumns().length)}>
                  <LoadingState label="Loading data" compact />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={Math.max(1, table.getVisibleLeafColumns().length)}>
                  <EmptyDataState title={emptyText} />
                </td>
              </tr>
            ) : (
              rows.map(row => (
                <tr
                  key={row.id}
                  data-clickable={Boolean(onRowClick) || undefined}
                  data-selected={row.getIsSelected() || undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  onKeyDown={event => handleRowKeyDown(event, row.original)}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="ef-data-table__pagination" aria-label="Table pagination">
          <span>
            Page {table.getState().pagination.pageIndex + 1}
            {hasKnownPageCount ? ` of ${Math.max(1, resolvedPageCount)}` : ''}
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
