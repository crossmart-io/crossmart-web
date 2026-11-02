import { StockLevel } from '@/api/schema';

type StockBadgeVariant = 'success' | 'warning' | 'destructive' | 'outline';

interface StockLevelCopy {
  label: string;
  badge: StockBadgeVariant;
}

export const STOCK_LEVEL_COPY: Record<StockLevel, StockLevelCopy> = {
  [StockLevel.in_stock]: { label: 'In stock', badge: 'success' },
  [StockLevel.low_stock]: { label: 'Low stock', badge: 'warning' },
  [StockLevel.out_of_stock]: { label: 'Out of stock', badge: 'destructive' },
  [StockLevel.untracked]: { label: 'Not tracked', badge: 'outline' },
};

/** The stock tabs above the inventory list. `All` is no filter. */
export const ALL_STOCK_LEVELS = 'all';
export type StockLevelFilter = StockLevel | typeof ALL_STOCK_LEVELS;

export const STOCK_LEVEL_FILTERS: readonly { value: StockLevelFilter; label: string }[] = [
  { value: ALL_STOCK_LEVELS, label: 'All' },
  ...Object.values(StockLevel).map((level) => ({
    value: level,
    label: STOCK_LEVEL_COPY[level].label,
  })),
];

export function toStockLevelFilter(value: string | null): StockLevelFilter {
  return STOCK_LEVEL_FILTERS.find((filter) => filter.value === value)?.value ?? ALL_STOCK_LEVELS;
}

export function toStockLevelQuery(filter: StockLevelFilter): StockLevel | undefined {
  return filter === ALL_STOCK_LEVELS ? undefined : filter;
}
