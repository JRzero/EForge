import {describe, expect, it} from 'vitest';
import {createListQueryState, updateListQueryState} from './query-state';

describe('list query state', () => {
  const initial = createListQueryState({
    filters: {role: 'All', status: 'Active'},
    pageIndex: 3,
    pageSize: 25,
  });

  it('creates a serializable route-independent state shape', () => {
    expect(initial).toEqual({
      search: '',
      filters: {role: 'All', status: 'Active'},
      sorting: [],
      pagination: {pageIndex: 3, pageSize: 25},
    });
  });

  it('resets page index when search, filters, or sorting change', () => {
    expect(updateListQueryState(initial, {search: 'nora'}).pagination.pageIndex).toBe(0);
    expect(
      updateListQueryState(initial, {filters: {role: 'Analyst', status: 'Active'}})
        .pagination.pageIndex,
    ).toBe(0);
    expect(
      updateListQueryState(initial, {sorting: [{id: 'name', desc: false}]})
        .pagination.pageIndex,
    ).toBe(0);
  });

  it('preserves explicit pagination updates', () => {
    expect(
      updateListQueryState(initial, {
        search: 'nora',
        pagination: {pageIndex: 2},
      }).pagination,
    ).toEqual({pageIndex: 2, pageSize: 25});

    expect(
      updateListQueryState(
        initial,
        {search: 'nora'},
        {resetPageOnQueryChange: false},
      ).pagination.pageIndex,
    ).toBe(3);
  });
});
