import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toInventoryRoute } from '@/config/routes';
import { STOCK_LEVEL_COPY } from '@/features/inventory';
import { cn } from '@/lib/utils';
import { STOCK_BAR_FILLS, STOCK_BAR_LEVELS } from '../inventory-report.constants';
import type { InventoryReport } from '../inventory-report.types';
import { stockLevelCounts } from '../stock-levels';

/** Variants by stock level as one bar, with a labelled count for each level. */
export function StockLevelBar({ report }: { report: InventoryReport }) {
  const counts = stockLevelCounts(report);
  const total = STOCK_BAR_LEVELS.reduce((sum, level) => sum + counts[level], 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock levels</CardTitle>
        <CardDescription>Every variant by how much is available to sell.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div
          className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          {total > 0 &&
            STOCK_BAR_LEVELS.filter((level) => counts[level] > 0).map((level) => (
              <div
                key={level}
                className={cn('h-full', STOCK_BAR_FILLS[level])}
                style={{ flexGrow: counts[level] }}
              />
            ))}
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STOCK_BAR_LEVELS.map((level) => (
            <li key={level}>
              <Link
                to={toInventoryRoute(level)}
                className="flex flex-col gap-0.5 rounded-md text-sm hover:underline"
              >
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span
                    className={cn('size-2 rounded-full', STOCK_BAR_FILLS[level])}
                    aria-hidden="true"
                  />
                  {STOCK_LEVEL_COPY[level].label}
                </span>
                <span className="font-medium tabular-nums">{counts[level].toLocaleString()}</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
