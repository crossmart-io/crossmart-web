import { useSearchParams } from 'react-router';
import { toSortOption } from '@/components/lists/sort-options';
import { PAGINATION_QUERY, ROUTE_QUERY } from '@/config/routes';
import { useDebouncedSearchParam } from '@/hooks/useDebouncedSearchParam';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { setOrDeleteParam } from '@/lib/search-params';
import { CHANNEL_PRODUCT_SORTS, CHANNEL_PRODUCTS_SEARCH_DEBOUNCE_MS } from '../listings.constants';
import { StoreListingView, toStoreListingSelection } from '../store-listing-views';

/**
 * The listings tab's view, search and sort, kept in the URL so a view can be shared. `state`
 * holds the view, or a precise state from a more specific link.
 */
export function useChannelProductFilters() {
  const [searchParams] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const search = useDebouncedSearchParam(ROUTE_QUERY.search, CHANNEL_PRODUCTS_SEARCH_DEBOUNCE_MS);
  const selection = toStoreListingSelection(searchParams.get(ROUTE_QUERY.state));
  const sort = toSortOption(CHANNEL_PRODUCT_SORTS, searchParams.get(ROUTE_QUERY.sort));

  const setParam = (key: string, value: string, defaultValue: string) =>
    updateParams((params) => setOrDeleteParam(params, key, value === defaultValue ? '' : value));
  /** Another view starts on its first page: the list it shows is another one. */
  const setView = (next: StoreListingView) =>
    updateParams((params) => {
      setOrDeleteParam(params, ROUTE_QUERY.state, next === StoreListingView.All ? '' : next);
      params.delete(PAGINATION_QUERY.page);
    });

  return {
    search,
    ...selection,
    setView,
    sort,
    setSort: (value: string) => setParam(ROUTE_QUERY.sort, value, CHANNEL_PRODUCT_SORTS[0].value),
  };
}
