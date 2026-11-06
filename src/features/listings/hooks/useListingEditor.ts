import { api } from '@/api/client';
import { isNotFoundError } from '@/api/api-error';
import { useInFlightPolling } from '@/hooks/useInFlightPolling';
import { isListingInFlight } from '../listing-states';
import { LISTING_EDITOR_ENDPOINT } from '../listings.constants';
import type { ListingEditor } from '../listings.types';
import type { ProductChannelRef } from './useProductChannels';

export interface ListingEditorQuery {
  data: ListingEditor | undefined;
  isPending: boolean;
  /** Why the listing could not be loaded, other than not existing; null when it loaded. */
  error: unknown;
  /** The product or the store is gone. */
  isMissing: boolean;
  refetch: () => void;
}

function isInFlight(listing: ListingEditor): boolean {
  return isListingInFlight(listing.displayState);
}

/**
 * One product in one store as the editor reads it: per field, the product's value, the store's
 * override and the result, with the listing's state. Refetches while the listing publishes, so
 * the editor shows its state live.
 */
export function useListingEditor(ref: ProductChannelRef): ListingEditorQuery {
  const refetchInterval = useInFlightPolling(isInFlight);
  const query = api.useQuery(
    'get',
    LISTING_EDITOR_ENDPOINT,
    { params: { path: ref } },
    { refetchInterval },
  );
  const isMissing = isNotFoundError(query.error);
  return {
    data: query.data,
    isPending: query.isPending,
    error: isMissing ? null : (query.error ?? null),
    isMissing,
    refetch: () => void query.refetch(),
  };
}
