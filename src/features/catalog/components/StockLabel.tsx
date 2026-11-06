import { cn } from '@/lib/utils';
import { pluralize } from '@/lib/format';

interface StockLabelProps {
  totalAvailable: number | null;
  variantCount: number;
}

/** "23 in stock", or "Oversold by 12" when more was sold than was on hand. */
function stockText(totalAvailable: number): string {
  return totalAvailable < 0
    ? `Oversold by ${Math.abs(totalAvailable).toLocaleString()}`
    : `${totalAvailable.toLocaleString()} in stock`;
}

export function StockLabel({ totalAvailable, variantCount }: StockLabelProps) {
  const variants = pluralize(variantCount, 'variant');
  if (totalAvailable === null) {
    return <span className="text-muted-foreground">Not tracked · {variants}</span>;
  }
  return (
    <span className={cn('tabular-nums', totalAvailable <= 0 && 'text-destructive')}>
      {stockText(totalAvailable)} <span className="text-muted-foreground">· {variants}</span>
    </span>
  );
}
