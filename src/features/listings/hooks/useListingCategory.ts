import { useMutation } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { api, fetchClient } from '@/api/client';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  CATEGORY_SUGGESTIONS_ENDPOINT,
  CHANNEL_LISTINGS_ENDPOINT,
  ITEM_SPECIFICS_ENDPOINT,
  LISTING_EDITOR_ENDPOINT,
  LISTING_CATEGORY_ENDPOINT,
  LISTINGS_FEEDBACK,
  PRODUCT_CHANNELS_ENDPOINT,
} from '../listings.constants';
import type { ChannelCategory, ProductChannel } from '../listings.types';
import type { ProductChannelRef } from './useProductChannels';

/** A new category has other item specifics, so they are read again too. */
const CATEGORY_ENDPOINTS = [
  PRODUCT_CHANNELS_ENDPOINT,
  CHANNEL_LISTINGS_ENDPOINT,
  ITEM_SPECIFICS_ENDPOINT,
  LISTING_EDITOR_ENDPOINT,
] as const;

/** The channel's categories for `search` (the title when empty); idle until searched. */
export function useCategorySuggestions(ref: ProductChannelRef, search: string | null) {
  return api.useQuery(
    'get',
    CATEGORY_SUGGESTIONS_ENDPOINT,
    { params: { path: ref, query: search ? { search } : {} } },
    { enabled: search !== null },
  );
}

/** Puts the listing in a category; null lets the next publish pick eBay's best match. */
export function useChooseListingCategory(ref: ProductChannelRef) {
  const refresh = useInvalidateEndpoints(CATEGORY_ENDPOINTS);
  return useMutation<ProductChannel, Error, ChannelCategory | null>({
    meta: { inlineError: true, successMessage: LISTINGS_FEEDBACK.categorySaved },
    mutationFn: (category) =>
      unwrap(
        fetchClient.PUT(LISTING_CATEGORY_ENDPOINT, {
          params: { path: ref },
          body: { category },
        }),
      ),
    onSuccess: refresh,
  });
}
