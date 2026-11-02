import { useMutation } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import { useInvalidateCatalog } from '@/features/catalog';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  INVENTORY_ADJUSTMENTS_ENDPOINT,
  INVENTORY_FEEDBACK,
  INVENTORY_ITEMS_ENDPOINT,
  INVENTORY_MOVEMENTS_ENDPOINT,
} from '../inventory.constants';
import type { AdjustStockBody, InventoryItem } from '../inventory.types';

const STOCK_ENDPOINTS = [INVENTORY_ITEMS_ENDPOINT, INVENTORY_MOVEMENTS_ENDPOINT];

interface AdjustStockVariables {
  inventoryItemId: string;
  body: AdjustStockBody;
}

/** Changes the stock on hand, then refreshes the inventory, its history, the catalog and the log. */
export function useAdjustStock(workspaceId: string) {
  const invalidateStock = useInvalidateEndpoints(STOCK_ENDPOINTS);
  const invalidateCatalog = useInvalidateCatalog();

  return useMutation<InventoryItem, Error, AdjustStockVariables>({
    meta: { successMessage: INVENTORY_FEEDBACK.adjusted, inlineError: true },
    mutationFn: async ({ inventoryItemId, body }) => {
      const { data, error } = await fetchClient.POST(INVENTORY_ADJUSTMENTS_ENDPOINT, {
        params: { path: { workspaceId, inventoryItemId } },
        body,
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: async () => {
      await Promise.all([invalidateStock(), invalidateCatalog()]);
    },
  });
}
