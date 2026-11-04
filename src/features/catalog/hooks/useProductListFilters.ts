import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { CatalogGap } from '@/api/schema';
import { ROUTE_QUERY } from '@/config/routes';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { SEARCH_DEBOUNCE_MS } from '../catalog.constants';
import { toCatalogGap } from '../catalog-gap';
import { ALL_STATUSES, type StatusFilter } from '../product-status';

export interface ProductListFilters {
  search: string;
  setSearch: (search: string) => void;
  /** The search the list is filtered by, once typing pauses. */
  debouncedSearch: string;
  status: StatusFilter;
  setStatus: (status: StatusFilter) => void;
  /** From the URL, so Catalog health can link to a filtered list. */
  gap: CatalogGap | undefined;
  clearGap: () => void;
  isFiltered: boolean;
  clearAll: () => void;
}

export function useProductListFilters(): ProductListFilters {
  const [searchParams, setSearchParams] = useSearchParams();
  const gap = toCatalogGap(searchParams.get(ROUTE_QUERY.gap));
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>(ALL_STATUSES);
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);

  function clearGap() {
    setSearchParams((params) => {
      params.delete(ROUTE_QUERY.gap);
      return params;
    });
  }

  function clearAll() {
    setSearch('');
    setStatus(ALL_STATUSES);
    clearGap();
  }

  return {
    search,
    setSearch,
    debouncedSearch,
    status,
    setStatus,
    gap,
    clearGap,
    isFiltered: Boolean(debouncedSearch) || status !== ALL_STATUSES || Boolean(gap),
    clearAll,
  };
}
