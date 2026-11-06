import { useMutation } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { api, fetchClient } from '@/api/client';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  CHANNEL_LISTINGS_ENDPOINT,
  CHANNEL_PRODUCTS_ENDPOINT,
  LISTING_OVERRIDE_ENDPOINT,
  LISTINGS_FEEDBACK,
  PRODUCT_CHANNEL_ENDPOINT,
  PRODUCT_CHANNELS_ENDPOINT,
  RETRY_LISTING_ENDPOINT,
} from '../listings.constants';
import { isListingInFlight } from '../listing-states';
import { PRODUCTS_ENDPOINT } from '@/features/catalog/catalog.constants';
import {
  CHANNEL_CONNECTION_DETAIL_ENDPOINT,
  CHANNEL_CONNECTIONS_ENDPOINT,
} from '@/features/channels/channels.constants';
import { useInFlightPolling } from '@/hooks/useInFlightPolling';
import type { ListingOverride, ProductChannel } from '../listings.types';

export interface ProductChannelRef {
  workspaceId: string;
  productId: string;
  connectionId: string;
}

const OVERRIDE_ENDPOINTS = [PRODUCT_CHANNELS_ENDPOINT, CHANNEL_LISTINGS_ENDPOINT] as const;
const MEMBERSHIP_ENDPOINTS = [
  PRODUCT_CHANNELS_ENDPOINT,
  CHANNEL_LISTINGS_ENDPOINT,
  CHANNEL_PRODUCTS_ENDPOINT,
] as const;

/** A retry also changes the product's store badges and the stores' failure counts. */
const RETRY_ENDPOINTS = [
  ...MEMBERSHIP_ENDPOINTS,
  PRODUCTS_ENDPOINT,
  CHANNEL_CONNECTIONS_ENDPOINT,
  CHANNEL_CONNECTION_DETAIL_ENDPOINT,
] as const;

function hasChannelInFlight(channels: readonly ProductChannel[]): boolean {
  return channels.some((channel) => isListingInFlight(channel.displayState));
}

/**
 * The product on each connected channel: listing, channel prices and shown stock. Refetches
 * while a listing is publishing or being removed, so its result shows without a reload.
 */
export function useProductChannels(workspaceId: string, productId: string) {
  const refetchInterval = useInFlightPolling(hasChannelInFlight);
  return api.useQuery(
    'get',
    PRODUCT_CHANNELS_ENDPOINT,
    { params: { path: { workspaceId, productId } } },
    { refetchInterval },
  );
}

/**
 * "Try again" on one product in one store: publishes it there again. The answer already shows
 * it publishing; the lists refetch and keep checking until it lands. Errors show beside it.
 */
export function useRetryListing(ref: ProductChannelRef) {
  const refresh = useInvalidateEndpoints(RETRY_ENDPOINTS);
  return useMutation<ProductChannel, Error>({
    meta: { inlineError: true, successMessage: LISTINGS_FEEDBACK.retryQueued },
    mutationFn: () => unwrap(fetchClient.POST(RETRY_LISTING_ENDPOINT, { params: { path: ref } })),
    onSuccess: refresh,
  });
}

export function useSaveListingOverride(ref: ProductChannelRef) {
  const refresh = useInvalidateEndpoints(OVERRIDE_ENDPOINTS);
  return useMutation<ProductChannel, Error, ListingOverride>({
    meta: { inlineError: true, successMessage: LISTINGS_FEEDBACK.overrideSaved },
    mutationFn: (body) =>
      unwrap(
        fetchClient.PUT(LISTING_OVERRIDE_ENDPOINT, {
          params: { path: ref },
          body,
        }),
      ),
    onSuccess: refresh,
  });
}

export function useClearListingOverride(ref: ProductChannelRef) {
  const refresh = useInvalidateEndpoints(OVERRIDE_ENDPOINTS);
  return useMutation<ProductChannel, Error>({
    meta: { successMessage: LISTINGS_FEEDBACK.overrideCleared },
    mutationFn: () =>
      unwrap(
        fetchClient.DELETE(LISTING_OVERRIDE_ENDPOINT, {
          params: { path: ref },
        }),
      ),
    onSuccess: refresh,
  });
}

/** Adds the product to the store: it stays until removed, and is published at once. */
export function useAddToStore(ref: ProductChannelRef) {
  const refresh = useInvalidateEndpoints(MEMBERSHIP_ENDPOINTS);
  return useMutation<ProductChannel, Error>({
    meta: { successMessage: LISTINGS_FEEDBACK.addedToStore },
    mutationFn: () =>
      unwrap(
        fetchClient.POST(PRODUCT_CHANNEL_ENDPOINT, {
          params: { path: ref },
        }),
      ),
    onSuccess: refresh,
  });
}

/** Removes the product from the store: it is delisted there at once. */
export function useRemoveFromStore(ref: ProductChannelRef) {
  const refresh = useInvalidateEndpoints(MEMBERSHIP_ENDPOINTS);
  return useMutation<ProductChannel, Error>({
    meta: { successMessage: LISTINGS_FEEDBACK.removedFromStore },
    mutationFn: () =>
      unwrap(
        fetchClient.DELETE(PRODUCT_CHANNEL_ENDPOINT, {
          params: { path: ref },
        }),
      ),
    onSuccess: refresh,
  });
}
