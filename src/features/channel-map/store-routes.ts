import { ChannelProductState, ProductStoreFilter } from '@/api/schema';
import { ROUTE_QUERY, toChannelConnectionRoute, toProductsRoute } from '@/config/routes';
import { type ChannelProductFilter, ChannelTab, NEEDS_DETAILS_FILTER } from '@/features/listings';
import { MapStatus } from './channel-map.constants';

/**
 * The filter of a store's Listings tab that lists the products of a map status. Products not
 * in the store are not on that tab: they are found in the catalog, filtered by the store.
 */
const STORE_TAB_FILTERS: Record<Exclude<MapStatus, MapStatus.NotListed>, ChannelProductFilter> = {
  [MapStatus.Published]: ChannelProductState.listed,
  [MapStatus.Pending]: ChannelProductState.pending,
  [MapStatus.NeedsDetails]: NEEDS_DETAILS_FILTER,
  [MapStatus.Failed]: ChannelProductState.failed,
};

/** A store's listings: every product it has, or only those of one map status. */
export function storeListingsRoute(connectionId: string, status?: MapStatus): string {
  if (status === MapStatus.NotListed) {
    return toProductsRoute({ storeFilter: ProductStoreFilter.not_in_store, storeId: connectionId });
  }
  const route = toChannelConnectionRoute(connectionId, ChannelTab.Listings);
  if (!status) return route;
  return `${route}?${new URLSearchParams({ [ROUTE_QUERY.state]: STORE_TAB_FILTERS[status] })}`;
}
