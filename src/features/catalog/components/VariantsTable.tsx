import { cn } from 'cn';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatMoney } from '@/lib/format';
import type { Product, Variant } from '../catalog.types';

interface VariantsTableProps {
  product: Product;
  currency: string;
}

export function VariantsTable({ product, currency }: VariantsTableProps) {
  const hasOptions = product.optionNames.length > 0;

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {hasOptions && <TableHead>{product.optionNames.join(' / ')}</TableHead>}
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Available</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {product.variants.map((variant) => (
            <VariantRow
              key={variant.id}
              variant={variant}
              currency={currency}
              hasOptions={hasOptions}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface VariantRowProps {
  variant: Variant;
  currency: string;
  hasOptions: boolean;
}

function VariantRow({ variant, currency, hasOptions }: VariantRowProps) {
  return (
    <TableRow>
      {hasOptions && (
        <TableCell className="font-medium">{variant.optionValues.join(' / ')}</TableCell>
      )}
      <TableCell className="font-mono text-xs">{variant.sku ?? '—'}</TableCell>
      <TableCell className="text-right tabular-nums">
        {variant.compareAtPrice && (
          <span className="mr-2 text-muted-foreground line-through">
            {formatMoney(variant.compareAtPrice, currency)}
          </span>
        )}
        {formatMoney(variant.price, currency)}
      </TableCell>
      <TableCell
        className={cn(
          'text-right tabular-nums',
          variant.tracked && variant.available <= 0 && 'text-destructive',
        )}
      >
        {variant.tracked ? variant.available.toLocaleString() : 'Not tracked'}
      </TableCell>
    </TableRow>
  );
}
