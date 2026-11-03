import { useSearchParams } from 'react-router';
import { toSortOption } from '@/components/lists/sort-options';
import { ROUTE_QUERY } from '@/config/routes';
import { useDebouncedSearchParam } from '@/hooks/useDebouncedSearchParam';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { setOrDeleteParam } from '@/lib/search-params';
import {
  ALL_CHANNEL_PRODUCTS,
  CHANNEL_PRODUCT_SORTS,
  CHANNEL_PRODUCTS_SEARCH_DEBOUNCE_MS,
  CHANNEL_PRODUCT_FILTERS,
  type ChannelProductFilter,
} from '../listings.constants';

function toFilter(value: string | null): ChannelProductFilter {
  return (
    CHANNEL_PRODUCT_FILTERS.find((filter) => filter.value === value)?.value ?? ALL_CHANNEL_PRODUCTS
  );
}

/** The products tab's filter, search and sort, kept in the URL so a view can be shared. */
export function useChannelProductFilters() {
  const [searchParams] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const search = useDebouncedSearchParam(ROUTE_QUERY.search, CHANNEL_PRODUCTS_SEARCH_DEBOUNCE_MS);
  const filter = toFilter(searchParams.get(ROUTE_QUERY.state));
  const sort = toSortOption(CHANNEL_PRODUCT_SORTS, searchParams.get(ROUTE_QUERY.sort));

  const setParam = (key: string, value: string, defaultValue: string) =>
    updateParams((params) => setOrDeleteParam(params, key, value === defaultValue ? '' : value));

  return {
    search,
    filter,
    setFilter: (next: ChannelProductFilter) =>
      setParam(ROUTE_QUERY.state, next, ALL_CHANNEL_PRODUCTS),
    sort,
    setSort: (value: string) => setParam(ROUTE_QUERY.sort, value, CHANNEL_PRODUCT_SORTS[0].value),
  };
}
