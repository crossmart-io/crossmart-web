import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchClient } from '@/api/client';
import { unwrap } from '@/api/unwrap';
// Imported from its file, not the feature's index, which itself uses the catalog.
import {
  CHANNEL_PRODUCTS_ENDPOINT,
  PRODUCT_CHANNELS_ENDPOINT,
} from '@/features/listings/listings.constants';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { MARK_SOLD_ENDPOINT } from '../catalog.constants';
import type { ProductSale } from '../catalog.types';
import { markSoldMessage } from '../sold/mark-sold';
import { useInvalidateCatalog } from './useInvalidateCatalog';

/** Its stores change too: it comes off each of them. */
const STORE_ENDPOINTS = [PRODUCT_CHANNELS_ENDPOINT, CHANNEL_PRODUCTS_ENDPOINT] as const;

/** Marks a product sold outside the stores: no stock left, and off every store. */
export function useMarkSold(workspaceId: string, productId: string) {
  const invalidateCatalog = useInvalidateCatalog();
  const invalidateStores = useInvalidateEndpoints(STORE_ENDPOINTS);
  return useMutation<ProductSale, Error>({
    mutationFn: () =>
      unwrap(
        fetchClient.POST(MARK_SOLD_ENDPOINT, { params: { path: { workspaceId, productId } } }),
      ),
    onSuccess: async (sale) => {
      toast.success(markSoldMessage(sale));
      await Promise.all([invalidateCatalog(), invalidateStores()]);
    },
  });
}
