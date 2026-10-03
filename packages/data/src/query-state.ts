import {useCallback, useState} from 'react';
import type {PaginationState, SortingState} from '@tanstack/react-table';

export interface ListQueryState<
  TFilters extends Record<string, unknown> = Record<string, unknown>,
> {
  search: string;
  filters: TFilters;
  sorting: SortingState;
  pagination: PaginationState;
}

export interface CreateListQueryStateOptions<
  TFilters extends Record<string, unknown>,
> {
  search?: string;
  filters: TFilters;
  sorting?: SortingState;
  pageIndex?: number;
  pageSize?: number;
}

export interface ListQueryStatePatch<
  TFilters extends Record<string, unknown>,
> {
  search?: string;
  filters?: TFilters;
  sorting?: SortingState;
  pagination?: Partial<PaginationState>;
}

export interface UpdateListQueryStateOptions {
  resetPageOnQueryChange?: boolean;
}

type StateUpdater<T> = T | ((previous: T) => T);

export function createListQueryState<
  TFilters extends Record<string, unknown>,
>({
  search = '',
  filters,
  sorting = [],
  pageIndex = 0,
  pageSize = 20,
}: CreateListQueryStateOptions<TFilters>): ListQueryState<TFilters> {
  return {
    search,
    filters: {...filters},
    sorting: [...sorting],
    pagination: {pageIndex, pageSize},
  };
}

export function updateListQueryState<
  TFilters extends Record<string, unknown>,
>(
  current: ListQueryState<TFilters>,
  patch: ListQueryStatePatch<TFilters>,
  {resetPageOnQueryChange = true}: UpdateListQueryStateOptions = {},
): ListQueryState<TFilters> {
  const queryChanged =
    Object.prototype.hasOwnProperty.call(patch, 'search') ||
    Object.prototype.hasOwnProperty.call(patch, 'filters') ||
    Object.prototype.hasOwnProperty.call(patch, 'sorting');

  const pagination = {
    ...current.pagination,
    ...patch.pagination,
  };

  if (
    resetPageOnQueryChange &&
    queryChanged &&
    patch.pagination?.pageIndex === undefined
  ) {
    pagination.pageIndex = 0;
  }

  return {
    search: patch.search ?? current.search,
    filters: patch.filters ? {...patch.filters} : current.filters,
    sorting: patch.sorting ? [...patch.sorting] : current.sorting,
    pagination,
  };
}

export function useListQueryState<
  TFilters extends Record<string, unknown>,
>(options: CreateListQueryStateOptions<TFilters>) {
  const [initialState] = useState(() => createListQueryState(options));
  const [state, setState] = useState<ListQueryState<TFilters>>(initialState);

  const update = useCallback(
    (
      patch: ListQueryStatePatch<TFilters>,
      updateOptions?: UpdateListQueryStateOptions,
    ) => {
      setState(current => updateListQueryState(current, patch, updateOptions));
    },
    [],
  );

  const setSearch = useCallback((search: string) => {
    setState(current => updateListQueryState(current, {search}));
  }, []);

  const setFilters = useCallback((filters: TFilters) => {
    setState(current => updateListQueryState(current, {filters}));
  }, []);

  const setSorting = useCallback((updater: StateUpdater<SortingState>) => {
    setState(current => {
      const sorting =
        typeof updater === 'function' ? updater(current.sorting) : updater;
      return updateListQueryState(current, {sorting});
    });
  }, []);

  const setPagination = useCallback(
    (updater: StateUpdater<PaginationState>) => {
      setState(current => {
        const pagination =
          typeof updater === 'function'
            ? updater(current.pagination)
            : updater;
        return updateListQueryState(
          current,
          {pagination},
          {resetPageOnQueryChange: false},
        );
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setState({
      ...initialState,
      filters: {...initialState.filters},
      sorting: [...initialState.sorting],
      pagination: {...initialState.pagination},
    });
  }, [initialState]);

  return {
    state,
    update,
    setSearch,
    setFilters,
    setSorting,
    setPagination,
    reset,
  };
}
