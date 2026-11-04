import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { INVENTORY_ITEMS_ENDPOINT, INVENTORY_MOVEMENTS_ENDPOINT } from '../inventory.constants';

const STOCK_ENDPOINTS = [INVENTORY_ITEMS_ENDPOINT, INVENTORY_MOVEMENTS_ENDPOINT];

/** Refreshes the inventory list and stock histories after stock changed. */
export function useInvalidateStock(): () => Promise<void> {
  return useInvalidateEndpoints(STOCK_ENDPOINTS);
}
