import { useMutation } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import { useInvalidateCatalog } from '@/features/catalog';
import { INVENTORY_ADJUSTMENTS_ENDPOINT, INVENTORY_FEEDBACK } from '../inventory.constants';
import type { AdjustStockBody, InventoryItem } from '../inventory.types';
import { useInvalidateStock } from './useInvalidateStock';

interface AdjustStockVariables {
  inventoryItemId: string;
  body: AdjustStockBody;
}

/** Changes the stock on hand, then refreshes the inventory, its history, the catalog and the log. */
export function useAdjustStock(workspaceId: string) {
  const invalidateStock = useInvalidateStock();
  const invalidateCatalog = useInvalidateCatalog();

  return useMutation<InventoryItem, Error, AdjustStockVariables>({
    meta: { successMessage: INVENTORY_FEEDBACK.adjusted, inlineError: true },
    mutationFn: ({ inventoryItemId, body }) =>
      unwrap(
        fetchClient.POST(INVENTORY_ADJUSTMENTS_ENDPOINT, {
          params: { path: { workspaceId, inventoryItemId } },
          body,
        }),
      ),
    onSuccess: async () => {
      await Promise.all([invalidateStock(), invalidateCatalog()]);
    },
  });
}
