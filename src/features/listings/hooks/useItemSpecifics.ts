import { useMutation } from '@tanstack/react-query';
import { api, fetchClient } from '@/api/client';
import { unwrap } from '@/api/unwrap';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  CHANNEL_LISTINGS_ENDPOINT,
  ITEM_SPECIFICS_ENDPOINT,
  LISTING_EDITOR_ENDPOINT,
  LISTINGS_FEEDBACK,
  PRODUCT_CHANNELS_ENDPOINT,
} from '../listings.constants';
import type { ItemSpecific, ListingItemSpecifics } from '../listings.types';
import type { ProductChannelRef } from './useProductChannels';

const ITEM_SPECIFICS_ENDPOINTS = [
  ITEM_SPECIFICS_ENDPOINT,
  PRODUCT_CHANNELS_ENDPOINT,
  CHANNEL_LISTINGS_ENDPOINT,
  LISTING_EDITOR_ENDPOINT,
] as const;

/** The listing category's item specifics and the values set on the listing. */
export function useItemSpecifics(ref: ProductChannelRef, enabled: boolean) {
  return api.useQuery('get', ITEM_SPECIFICS_ENDPOINT, { params: { path: ref } }, { enabled });
}

/** Replaces the listing's item specifics; eBay gets them on the next publish or update. */
export function useSaveItemSpecifics(ref: ProductChannelRef) {
  const refresh = useInvalidateEndpoints(ITEM_SPECIFICS_ENDPOINTS);
  return useMutation<ListingItemSpecifics, Error, ItemSpecific[]>({
    meta: { inlineError: true, successMessage: LISTINGS_FEEDBACK.itemSpecificsSaved },
    mutationFn: (itemSpecifics) =>
      unwrap(
        fetchClient.PUT(ITEM_SPECIFICS_ENDPOINT, {
          params: { path: ref },
          body: { itemSpecifics },
        }),
      ),
    onSuccess: refresh,
  });
}
