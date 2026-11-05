import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { pluralize } from '@/lib/format';
import {
  ADD_STORE_PRODUCTS_ENDPOINT,
  CHANNEL_LISTINGS_ENDPOINT,
  CHANNEL_PRODUCTS_ENDPOINT,
  PRODUCT_CHANNELS_ENDPOINT,
  REMOVE_STORE_PRODUCTS_ENDPOINT,
  STORE_PRODUCTS_BATCH_SIZE,
} from '../listings.constants';
import { chunk } from '@/lib/chunk';

const MEMBERSHIP_ENDPOINTS = [
  CHANNEL_PRODUCTS_ENDPOINT,
  CHANNEL_LISTINGS_ENDPOINT,
  PRODUCT_CHANNELS_ENDPOINT,
] as const;

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

type MembershipEndpoint =
  typeof ADD_STORE_PRODUCTS_ENDPOINT | typeof REMOVE_STORE_PRODUCTS_ENDPOINT;

/** Sends the products in batches the API accepts, and returns how many it took. */
async function sendInBatches(
  endpoint: MembershipEndpoint,
  ref: ConnectionRef,
  productIds: readonly string[],
): Promise<number> {
  let count = 0;
  for (const batch of chunk(productIds, STORE_PRODUCTS_BATCH_SIZE)) {
    const data = await unwrap(
      fetchClient.POST(endpoint, {
        params: { path: ref },
        body: { productIds: batch },
      }),
    );
    count += data.count;
  }
  return count;
}

function useMembershipChange(endpoint: MembershipEndpoint, describe: (count: number) => string) {
  const refresh = useInvalidateEndpoints(MEMBERSHIP_ENDPOINTS);
  return useMutation<number, Error, { ref: ConnectionRef; productIds: readonly string[] }>({
    mutationFn: ({ ref, productIds }) => sendInBatches(endpoint, ref, productIds),
    onSuccess: async (count) => {
      toast.success(describe(count));
      await refresh();
    },
  });
}

/** Adds products to a store, as the products table's bulk action does. */
export function useAddStoreProducts() {
  return useMembershipChange(
    ADD_STORE_PRODUCTS_ENDPOINT,
    (count) => `${pluralize(count, 'product')} added; publishing now`,
  );
}

/** Removes products from a store; they are delisted there now. */
export function useRemoveStoreProducts() {
  return useMembershipChange(
    REMOVE_STORE_PRODUCTS_ENDPOINT,
    (count) => `${pluralize(count, 'product')} removed from the store`,
  );
}
