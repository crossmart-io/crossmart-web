import { useSearchParams } from 'react-router';
import type { CatalogGap, ProductStatus } from '@/api/schema';
import { ROUTE_QUERY } from '@/config/routes';
import { useDebouncedSearchParam } from '@/hooks/useDebouncedSearchParam';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { setOrDeleteParam } from '@/lib/search-params';
import { SEARCH_DEBOUNCE_MS } from '../catalog.constants';
import { toCatalogGap } from '../catalog-gap';
import { ALL_STATUSES, type StatusFilter, toStatusFilter, toStatusQuery } from '../product-status';
import { type ProductSort, ProductStoreFilter } from '@/api/schema';
import { type SortOption, toSortOption } from '@/components/lists/sort-options';
import { PRODUCT_SORTS } from '../catalog.constants';

/** The products table's store filter, as the URL holds it. */
interface StoreFilterValue {
  filter?: ProductStoreFilter;
  storeId?: string;
}

/** Store filters about one store need its id; without one they are dropped. */
const STORE_FILTERS_WITH_STORE: ReadonlySet<ProductStoreFilter> = new Set([
  ProductStoreFilter.in_store,
  ProductStoreFilter.not_in_store,
]);

function toStoreFilter(filter: string | null, storeId: string | null): StoreFilterValue {
  const known = Object.values(ProductStoreFilter).find((value) => value === filter);
  if (!known) return {};
  if (STORE_FILTERS_WITH_STORE.has(known)) return storeId ? { filter: known, storeId } : {};
  return { filter: known };
}

/** The filters a saved view stores: absent ones mean "any". */
interface ListFilterValues {
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
  /** Which stores the products are in, with the store it is about when there is one. */
  store: StoreFilterValue;
  setStore: (store: StoreFilterValue) => void;
  sort: SortOption<ProductSort>;
  setSort: (value: string) => void;
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
  const store = toStoreFilter(
    searchParams.get(ROUTE_QUERY.storeFilter),
    searchParams.get(ROUTE_QUERY.storeId),
  );
  const sort = toSortOption(PRODUCT_SORTS, searchParams.get(ROUTE_QUERY.sort));
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
    store,
    setStore: (next) =>
      updateParams((params) => {
        setOrDeleteParam(params, ROUTE_QUERY.storeFilter, next.filter ?? '');
        setOrDeleteParam(params, ROUTE_QUERY.storeId, next.storeId ?? '');
      }),
    sort,
    setSort: (value) =>
      updateParams((params) =>
        setOrDeleteParam(params, ROUTE_QUERY.sort, value === PRODUCT_SORTS[0].value ? '' : value),
      ),
    isFiltered:
      Boolean(debouncedSearch) || status !== ALL_STATUSES || Boolean(gap) || Boolean(store.filter),
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
