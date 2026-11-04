import { StockLevel } from '@/api/schema';
import type { InventoryReport } from './inventory-report.types';

/** The report's count for each stock level. */
export function stockLevelCounts(report: InventoryReport): Record<StockLevel, number> {
  const { inStock, lowStock, outOfStock, untracked } = report.stockLevels;
  return {
    [StockLevel.in_stock]: inStock,
    [StockLevel.low_stock]: lowStock,
    [StockLevel.out_of_stock]: outOfStock,
    [StockLevel.untracked]: untracked,
  };
}
