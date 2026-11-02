import { useSearchParams } from 'react-router';
import type { CatalogGap, ProductStatus } from '@/api/schema';
import { ROUTE_QUERY } from '@/config/routes';
import { useDebouncedSearchParam } from '@/hooks/useDebouncedSearchParam';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { setOrDeleteParam } from '@/lib/search-params';
import { SEARCH_DEBOUNCE_MS } from '../catalog.constants';
import { toCatalogGap } from '../catalog-gap';
import { ALL_STATUSES, type StatusFilter, toStatusFilter, toStatusQuery } from '../product-status';

/** The filters a saved view stores: absent ones mean "any". */
export interface ListFilterValues {
  search?: string | null;
  status?: ProductStatus | null;
  gap?: CatalogGap | null;
}

export interface ProductListFilters {
  /** What is in the search box right now. */
  search: string;
  setSearch: (search: string) => void;
  /** The search the list is filtered by, once typing pauses. */
  debouncedSearch: string;
  status: StatusFilter;
  setStatus: (status: StatusFilter) => void;
  gap: CatalogGap | undefined;
  clearGap: () => void;
  isFiltered: boolean;
  clearAll: () => void;
  /** Replaces every filter at once, as opening a saved view does. */
  applyFilters: (values: ListFilterValues) => void;
}

/**
 * Search, status and gap live in the URL, so a filtered list can be linked to and comes back
 * as it was after opening a product. URL updates replace the entry instead of adding history.
 */
export function useProductListFilters(): ProductListFilters {
  const [searchParams] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const status = toStatusFilter(searchParams.get(ROUTE_QUERY.status));
  const gap = toCatalogGap(searchParams.get(ROUTE_QUERY.gap));
  const {
    value: search,
    setValue: setSearch,
    debouncedValue: debouncedSearch,
  } = useDebouncedSearchParam(ROUTE_QUERY.search, SEARCH_DEBOUNCE_MS);

  return {
    search,
    setSearch,
    debouncedSearch,
    status,
    setStatus: (next) =>
      updateParams((params) =>
        setOrDeleteParam(params, ROUTE_QUERY.status, next === ALL_STATUSES ? '' : next),
      ),
    gap,
    clearGap: () => updateParams((params) => params.delete(ROUTE_QUERY.gap)),
    isFiltered: Boolean(debouncedSearch) || status !== ALL_STATUSES || Boolean(gap),
    clearAll: () => {
      setSearch('');
      updateParams((params) => Object.values(ROUTE_QUERY).forEach((key) => params.delete(key)));
    },
    applyFilters: (values) => {
      setSearch(values.search ?? '');
      updateParams((params) => {
        setOrDeleteParam(params, ROUTE_QUERY.search, values.search ?? '');
        setOrDeleteParam(params, ROUTE_QUERY.status, values.status ?? '');
        setOrDeleteParam(params, ROUTE_QUERY.gap, values.gap ?? '');
      });
    },
  };
}

/** True when the list shows exactly what the view saved. */
export function matchesFilters(filters: ProductListFilters, values: ListFilterValues): boolean {
  return (
    filters.debouncedSearch === (values.search ?? '') &&
    toStatusQuery(filters.status) === (values.status ?? undefined) &&
    filters.gap === (values.gap ?? undefined)
  );
}
