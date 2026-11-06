import { CircleCheck } from 'lucide-react';
import { Link } from 'react-router';
import { StockLevel } from '@/api/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toInventoryRoute, toProductRoute } from '@/config/routes';
import { StockLevelBadge, variantLabel } from '@/features/inventory';
import { LOWEST_STOCK_COPY } from '../inventory-report.constants';
import type { InventoryReport, LowStockVariant } from '../inventory-report.types';

function LowStockRow({ item }: { item: LowStockVariant }) {
  const variant = variantLabel(item) ?? item.sku;
  return (
    <li className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <div className="flex min-w-0 flex-col">
        <Link
          to={toProductRoute(item.productId)}
          className="truncate text-sm font-medium hover:underline"
          title={item.productTitle}
        >
          {item.productTitle}
        </Link>
        {variant && <span className="truncate text-xs text-muted-foreground">{variant}</span>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-medium tabular-nums">
          {item.available.toLocaleString()}
          <span className="sr-only"> available</span>
        </span>
        <StockLevelBadge level={item.stockLevel} />
      </div>
    </li>
  );
}

/** The variants to restock first: out of stock (oversold before sold out), then the lowest. */
export function LowestStockCard({ report }: { report: InventoryReport }) {
  const items = report.lowestStock;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{LOWEST_STOCK_COPY.title}</CardTitle>
        <CardDescription>{LOWEST_STOCK_COPY.description(report.lowStockThreshold)}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CircleCheck className="size-4 text-success" aria-hidden="true" />
            {LOWEST_STOCK_COPY.empty}
          </p>
        ) : (
          <>
            <ul className="flex flex-col divide-y">
              {items.map((item) => (
                <LowStockRow key={item.inventoryItemId} item={item} />
              ))}
            </ul>
            <Link
              to={toInventoryRoute(StockLevel.out_of_stock)}
              className="mt-3 inline-block text-xs font-medium text-muted-foreground hover:underline"
            >
              {LOWEST_STOCK_COPY.viewAll}
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
