import { ListingStatus, StockLevel } from '@/api/schema';

export const INVENTORY_REPORT_ENDPOINT = '/api/v1/workspaces/{workspaceId}/analytics/inventory';

/** Stock levels left to right on the bar: what sells, what is running out, what is gone. */
export const STOCK_BAR_LEVELS: readonly StockLevel[] = [
  StockLevel.in_stock,
  StockLevel.low_stock,
  StockLevel.out_of_stock,
  StockLevel.untracked,
];

/** Status fills: reserved colors, always shown with a label and a count beside them. */
export const STOCK_BAR_FILLS: Record<StockLevel, string> = {
  [StockLevel.in_stock]: 'bg-success',
  [StockLevel.low_stock]: 'bg-warning',
  [StockLevel.out_of_stock]: 'bg-destructive',
  [StockLevel.untracked]: 'bg-muted-foreground/40',
};

/** Listing statuses a store row spells out; delisted ones are history. */
export const STORE_HEALTH_STATUSES: readonly ListingStatus[] = [
  ListingStatus.ACTIVE,
  ListingStatus.PENDING,
  ListingStatus.INACTIVE,
  ListingStatus.ERROR,
];
