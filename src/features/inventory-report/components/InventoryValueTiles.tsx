import { Link } from 'react-router';
import { toInventoryRoute } from '@/config/routes';
import { formatMoney, pluralize } from '@/lib/format';
import type { InventoryReport } from '../inventory-report.types';
import { MetricTile } from './MetricTile';

/** What the stock on hand is worth, and how much of it is about to run out. */
export function InventoryValueTiles({ report }: { report: InventoryReport }) {
  const { value, stockLevels, currencyCode } = report;
  const short = stockLevels.lowStock + stockLevels.outOfStock;
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <MetricTile
        label="Stock value at cost"
        value={formatMoney(value.atCost, currencyCode)}
        detail={
          value.variantsWithoutCost > 0
            ? `${pluralize(value.variantsWithoutCost, 'variant')} in stock without a cost`
            : 'Every variant in stock has a cost'
        }
      />
      <MetricTile
        label="Stock value at price"
        value={formatMoney(value.atPrice, currencyCode)}
        detail="What the stock on hand sells for"
      />
      <MetricTile
        label="Units on hand"
        value={value.unitsOnHand.toLocaleString()}
        detail="Available plus held for open orders"
      />
      <MetricTile
        label="Low or out of stock"
        value={short.toLocaleString()}
        detail={
          <Link to={toInventoryRoute()} className="underline-offset-2 hover:underline">
            {stockLevels.outOfStock} out · {stockLevels.lowStock} with {report.lowStockThreshold} or
            fewer left
          </Link>
        }
      />
    </div>
  );
}
