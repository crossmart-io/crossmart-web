import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import { INVENTORY_MOVEMENTS_ENDPOINT } from '../inventory.constants';
import type { InventoryMovement } from '../inventory.types';

interface MovementsTarget {
  workspaceId: string;
  /** Null while no history is open. */
  inventoryItemId: string | null;
}

async function fetchMovementPage(
  { workspaceId, inventoryItemId }: MovementsTarget,
  page: { page: number; limit: number },
  signal: AbortSignal,
) {
  const { data, error } = await fetchClient.GET(INVENTORY_MOVEMENTS_ENDPOINT, {
    params: {
      path: { workspaceId, inventoryItemId: inventoryItemId ?? '' },
      query: page,
    },
    signal,
  });
  if (error) throw ApiRequestError.from(error);
  return data;
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
