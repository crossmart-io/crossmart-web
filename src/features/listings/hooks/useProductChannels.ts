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
} from '../listings.constants';
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

/** The product on each connected channel: listing, channel prices and shown stock. */
export function useProductChannels(workspaceId: string, productId: string) {
  return api.useQuery('get', PRODUCT_CHANNELS_ENDPOINT, {
    params: { path: { workspaceId, productId } },
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
