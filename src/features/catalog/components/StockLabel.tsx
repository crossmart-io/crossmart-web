import { pluralize } from '@/lib/format';

interface StockLabelProps {
  totalAvailable: number | null;
  variantCount: number;
}

export function StockLabel({ totalAvailable, variantCount }: StockLabelProps) {
  const variants = pluralize(variantCount, 'variant');
  if (totalAvailable === null) {
    return <span className="text-muted-foreground">Not tracked · {variants}</span>;
  }
  return (
    <span className={totalAvailable <= 0 ? 'text-destructive' : undefined}>
      {totalAvailable.toLocaleString()} in stock{' '}
      <span className="text-muted-foreground">· {variants}</span>
    </span>
  );
}
