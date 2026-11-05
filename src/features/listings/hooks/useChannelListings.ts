import { useMutation } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import { useCursorPages } from '@/hooks/useCursorPages';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { pluralize } from '@/lib/format';
import {
  CHANNEL_LISTINGS_ENDPOINT,
  CHANNEL_LISTINGS_PAGE_SIZE,
  CHANNEL_PRODUCTS_ENDPOINT,
  PRODUCT_CHANNELS_ENDPOINT,
  SYNC_ENDPOINT,
} from '../listings.constants';
import type { ChannelListing, SyncRequestResult } from '../listings.types';
import { toast } from 'sonner';

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

const SYNC_ENDPOINTS = [
  CHANNEL_LISTINGS_ENDPOINT,
  CHANNEL_PRODUCTS_ENDPOINT,
  PRODUCT_CHANNELS_ENDPOINT,
] as const;

/** The connection's listings, most recently changed first, a page at a time. */
export function useChannelListings(ref: ConnectionRef) {
  const query = useCursorPages<ChannelListing>({
    endpoint: CHANNEL_LISTINGS_ENDPOINT,
    params: ref,
    fetchPage: async (cursor, signal) => {
      const { data, error } = await fetchClient.GET(CHANNEL_LISTINGS_ENDPOINT, {
        params: { path: ref, query: { cursor, limit: CHANNEL_LISTINGS_PAGE_SIZE } },
        signal,
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    staleTime: 0,
  });
  return { ...query, listings: query.items };
}

/** What the merchant reads once a sync is queued. */
function describeSyncRequest({ queued, delisting }: SyncRequestResult): string {
  const parts = [`${pluralize(queued, 'product')} queued to publish`];
  if (delisting > 0) parts.push(`${pluralize(delisting, 'listing')} to delist`);
  return parts.join(', ');
}

/** "Publish selected products" / "Sync now": queues the whole selection. */
export function useRequestSync(ref: ConnectionRef) {
  const refresh = useInvalidateEndpoints(SYNC_ENDPOINTS);
  return useMutation<SyncRequestResult, Error>({
    mutationFn: async () => {
      const { data, error } = await fetchClient.POST(SYNC_ENDPOINT, { params: { path: ref } });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: async (result) => {
      toast.success(describeSyncRequest(result));
      await refresh();
    },
  });
}
