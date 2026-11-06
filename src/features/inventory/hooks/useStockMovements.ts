import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import type { InventoryMovementReason, SortDirection } from '@/api/schema';
import { INVENTORY_MOVEMENTS_ENDPOINT } from '../inventory.constants';
import type { InventoryMovement } from '../inventory.types';

interface MovementsTarget {
  workspaceId: string;
  /** Null while no history is open. */
  inventoryItemId: string | null;
  reason?: InventoryMovementReason;
  direction: SortDirection;
}

async function fetchMovementPage(
  { workspaceId, inventoryItemId, ...filters }: MovementsTarget,
  page: { page: number; limit: number },
  signal: AbortSignal,
) {
  return unwrap(
    fetchClient.GET(INVENTORY_MOVEMENTS_ENDPOINT, {
      params: {
        path: { workspaceId, inventoryItemId: inventoryItemId ?? '' },
        query: { ...filters, ...page },
      },
      signal,
    }),
  );
}

/** The stock history of one variant, newest first. */
export function useStockMovements(target: MovementsTarget, pagination: Pagination) {
  const query = usePagedList<InventoryMovement>({
    endpoint: INVENTORY_MOVEMENTS_ENDPOINT,
    params: target,
    pagination,
    fetchPage: (page, signal) => fetchMovementPage(target, page, signal),
    enabled: Boolean(target.inventoryItemId),
  });
  return { ...query, movements: query.items };
}
