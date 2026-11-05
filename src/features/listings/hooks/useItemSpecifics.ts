import { useMutation } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { api, fetchClient } from '@/api/client';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  CHANNEL_LISTINGS_ENDPOINT,
  ITEM_SPECIFICS_ENDPOINT,
  LISTINGS_FEEDBACK,
  PRODUCT_CHANNELS_ENDPOINT,
} from '../listings.constants';
import type { ItemSpecific, ListingItemSpecifics } from '../listings.types';
import type { ProductChannelRef } from './useProductChannels';

const ITEM_SPECIFICS_ENDPOINTS = [
  ITEM_SPECIFICS_ENDPOINT,
  PRODUCT_CHANNELS_ENDPOINT,
  CHANNEL_LISTINGS_ENDPOINT,
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
    mutationFn: async (itemSpecifics) => {
      const { data, error } = await fetchClient.PUT(ITEM_SPECIFICS_ENDPOINT, {
        params: { path: ref },
        body: { itemSpecifics },
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: refresh,
  });
}
