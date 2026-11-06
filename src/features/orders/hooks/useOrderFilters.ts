import { useSearchParams } from 'react-router';
import { OrderStatus } from '@/api/schema';
import {
  type ByTime,
  type SortOption,
  TIME_SORTS,
  toSortOption,
} from '@/components/lists/sort-options';
import { ROUTE_QUERY } from '@/config/routes';
import { useDebouncedSearchParam } from '@/hooks/useDebouncedSearchParam';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { parseEnum } from '@/lib/enum';
import { setOrDeleteParam } from '@/lib/search-params';
import { ORDER_SEARCH_DEBOUNCE_MS } from '../orders.constants';

export interface OrderFilters {
  search: string;
  setSearch: (search: string) => void;
  debouncedSearch: string;
  status: OrderStatus | undefined;
  setStatus: (status: OrderStatus | undefined) => void;
  storeId: string | undefined;
  setStoreId: (storeId: string | undefined) => void;
  sort: SortOption<ByTime>;
  setSort: (value: string) => void;
  isFiltered: boolean;
  clearAll: () => void;
}

/** The orders table's filters, in the URL so a filtered list can be linked to. */
export function useOrderFilters(): OrderFilters {
  const [searchParams] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const search = useDebouncedSearchParam(ROUTE_QUERY.search, ORDER_SEARCH_DEBOUNCE_MS);
  const status = parseEnum(OrderStatus, searchParams.get(ROUTE_QUERY.status));
  const storeId = searchParams.get(ROUTE_QUERY.storeId) ?? undefined;
  const sort = toSortOption(TIME_SORTS, searchParams.get(ROUTE_QUERY.sort));
  const set = (key: string, value: string | undefined) =>
    updateParams((params) => setOrDeleteParam(params, key, value ?? ''));
  return {
    search: search.value,
    setSearch: search.setValue,
    debouncedSearch: search.debouncedValue,
    status,
    setStatus: (next) => set(ROUTE_QUERY.status, next),
    storeId,
    setStoreId: (next) => set(ROUTE_QUERY.storeId, next),
    sort,
    setSort: (value) => set(ROUTE_QUERY.sort, value === TIME_SORTS[0].value ? undefined : value),
    isFiltered: Boolean(search.debouncedValue || status || storeId),
    clearAll: () => {
      search.setValue('');
      updateParams((params) => {
        for (const key of [ROUTE_QUERY.search, ROUTE_QUERY.status, ROUTE_QUERY.storeId]) {
          params.delete(key);
        }
      });
    },
  };
}
