import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import { useCursorPages } from '@/hooks/useCursorPages';
import { INVENTORY_MOVEMENTS_ENDPOINT, MOVEMENTS_PAGE_SIZE } from '../inventory.constants';
import type { InventoryMovement } from '../inventory.types';

interface MovementsTarget {
  workspaceId: string;
  /** Null while no history is open. */
  inventoryItemId: string | null;
}

async function fetchMovementPage(
  { workspaceId, inventoryItemId }: MovementsTarget,
  cursor: string | undefined,
  signal: AbortSignal,
) {
  const { data, error } = await fetchClient.GET(INVENTORY_MOVEMENTS_ENDPOINT, {
    params: {
      path: { workspaceId, inventoryItemId: inventoryItemId ?? '' },
      query: { cursor, limit: MOVEMENTS_PAGE_SIZE },
    },
    signal,
  });
  if (error) throw ApiRequestError.from(error);
  return data;
}

/** The stock history of one variant, newest first. */
export function useStockMovements(target: MovementsTarget) {
  const query = useCursorPages<InventoryMovement>({
    endpoint: INVENTORY_MOVEMENTS_ENDPOINT,
    params: target,
    fetchPage: (cursor, signal) => fetchMovementPage(target, cursor, signal),
    enabled: Boolean(target.inventoryItemId),
  });
  return { ...query, movements: query.items };
}
