import { useSearchParams } from 'react-router';
import { ROUTE_QUERY } from '@/config/routes';
import { SEARCH_DEBOUNCE_MS } from '@/features/catalog';
import { useDebouncedSearchParam } from '@/hooks/useDebouncedSearchParam';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { setOrDeleteParam } from '@/lib/search-params';
import { ALL_STOCK_LEVELS, type StockLevelFilter, toStockLevelFilter } from '../stock-level';

export interface InventoryListFilters {
  search: string;
  setSearch: (search: string) => void;
  debouncedSearch: string;
  stockLevel: StockLevelFilter;
  setStockLevel: (stockLevel: StockLevelFilter) => void;
  isFiltered: boolean;
  clearAll: () => void;
}

/** Search and stock level live in the URL, so "low stock" can be linked to and bookmarked. */
export function useInventoryListFilters(): InventoryListFilters {
  const [searchParams] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const stockLevel = toStockLevelFilter(searchParams.get(ROUTE_QUERY.stockLevel));
  const {
    value: search,
    setValue: setSearch,
    debouncedValue: debouncedSearch,
  } = useDebouncedSearchParam(ROUTE_QUERY.search, SEARCH_DEBOUNCE_MS);

  return {
    search,
    setSearch,
    debouncedSearch,
    stockLevel,
    setStockLevel: (next) =>
      updateParams((params) =>
        setOrDeleteParam(params, ROUTE_QUERY.stockLevel, next === ALL_STOCK_LEVELS ? '' : next),
      ),
    isFiltered: Boolean(debouncedSearch) || stockLevel !== ALL_STOCK_LEVELS,
    clearAll: () => {
      setSearch('');
      updateParams((params) => {
        params.delete(ROUTE_QUERY.search);
        params.delete(ROUTE_QUERY.stockLevel);
      });
    },
  };
}
