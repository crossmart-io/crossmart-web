import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import type { StockLevel } from '@/api/schema';
import { useCursorPages } from '@/hooks/useCursorPages';
import { INVENTORY_ITEMS_ENDPOINT, INVENTORY_PAGE_SIZE } from '../inventory.constants';
import type { InventoryItem } from '../inventory.types';

interface InventoryFilter {
  workspaceId: string | undefined;
  search: string;
  stockLevel: StockLevel | undefined;
}

async function fetchInventoryPage(
  { workspaceId, search, stockLevel }: InventoryFilter,
  cursor: string | undefined,
  signal: AbortSignal,
) {
  const { data, error } = await fetchClient.GET(INVENTORY_ITEMS_ENDPOINT, {
    params: {
      path: { workspaceId: workspaceId ?? '' },
      query: { search: search || undefined, stockLevel, cursor, limit: INVENTORY_PAGE_SIZE },
    },
    signal,
  });
  if (error) throw ApiRequestError.from(error);
  return data;
}

/** Stock rows by product title, a page at a time (the API pages by cursor). */
export function useInventory(filter: InventoryFilter) {
  const query = useCursorPages<InventoryItem>({
    endpoint: INVENTORY_ITEMS_ENDPOINT,
    params: filter,
    fetchPage: (cursor, signal) => fetchInventoryPage(filter, cursor, signal),
    enabled: Boolean(filter.workspaceId),
    keepPreviousPages: true,
    // Stock also changes in the product editor, so refetch on every visit.
    staleTime: 0,
  });
  return query;
}
