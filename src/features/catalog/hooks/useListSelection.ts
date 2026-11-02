import { useEffect } from 'react';
import { type Selection, useSelection } from '@/hooks/useSelection';
import type { ProductListFilters } from './useProductListFilters';

/**
 * Checked products of the list. A bulk action must only touch products the seller can see,
 * so changing the search, status or gap starts the selection over.
 */
export function useListSelection(filters: ProductListFilters): Selection {
  const selection = useSelection();
  const { clear } = selection;
  const filterKey = [filters.debouncedSearch, filters.status, filters.gap].join('|');

  useEffect(() => clear(), [filterKey, clear]);

  return selection;
}
