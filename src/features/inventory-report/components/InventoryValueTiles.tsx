import { Link } from 'react-router';
import { toStockRoute } from '@/config/routes';
import { formatMoney, pluralize } from '@/lib/format';
import { NO_VALUE } from '../inventory-report.constants';
import type { InventoryReport } from '../inventory-report.types';
import { MetricTile } from './MetricTile';

/**
 * Stock at cost, unless no variant in stock has a cost: a zero there would be invented, so the
 * tile shows a dash and says how many variants lack one.
 */
function costedValue(value: InventoryReport['value'], currencyCode: string): string {
  const noCostAtAll = value.variantsWithoutCost > 0 && Number(value.atCost) === 0;
  return noCostAtAll ? NO_VALUE : formatMoney(value.atCost, currencyCode);
}

/** What the stock on hand is worth, and how much of it is about to run out. */
export function InventoryValueTiles({ report }: { report: InventoryReport }) {
  const { value, stockLevels, currencyCode } = report;
  const short = stockLevels.lowStock + stockLevels.outOfStock;
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <MetricTile
        label="Stock value at cost"
        value={costedValue(value, currencyCode)}
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
          <Link to={toStockRoute()} className="underline-offset-2 hover:underline">
            {stockLevels.outOfStock} out · {stockLevels.lowStock} with {report.lowStockThreshold} or
            fewer left
          </Link>
        }
      />
    </div>
  );
}
