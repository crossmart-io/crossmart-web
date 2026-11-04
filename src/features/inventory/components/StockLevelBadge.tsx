import type { StockLevel } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { STOCK_LEVEL_COPY } from '../stock-level';

export function StockLevelBadge({ level }: { level: StockLevel }) {
  const copy = STOCK_LEVEL_COPY[level];
  return (
    <Badge variant={copy.badge}>
      <span data-dot className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {copy.label}
    </Badge>
  );
}
