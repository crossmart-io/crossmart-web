import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import type { InventorySort, SortDirection, StockLevel } from '@/api/schema';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import { INVENTORY_ITEMS_ENDPOINT } from '../inventory.constants';
import type { InventoryItem } from '../inventory.types';

interface InventoryFilter {
  workspaceId: string | undefined;
  search: string;
  stockLevel: StockLevel | undefined;
  sort: InventorySort;
  direction: SortDirection;
}

async function fetchInventoryPage(
  { workspaceId, search, ...filters }: InventoryFilter,
  page: { page: number; limit: number },
  signal: AbortSignal,
) {
  return unwrap(
    fetchClient.GET(INVENTORY_ITEMS_ENDPOINT, {
      params: {
        path: { workspaceId: workspaceId ?? '' },
        query: { search: search || undefined, ...filters, ...page },
      },
      signal,
    }),
  );
}

/** One numbered page of stock rows, by product title. */
export function useInventory(filter: InventoryFilter, pagination: Pagination) {
  const query = usePagedList<InventoryItem>({
    endpoint: INVENTORY_ITEMS_ENDPOINT,
    params: filter,
    pagination,
    fetchPage: (page, signal) => fetchInventoryPage(filter, page, signal),
    enabled: Boolean(filter.workspaceId),
    // Stock also changes in the product editor, so refetch on every visit.
    staleTime: 0,
  });
  return query;
}
