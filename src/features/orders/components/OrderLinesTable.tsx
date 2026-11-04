import { Link } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toProductRoute } from '@/config/routes';
import { formatMoney } from '@/lib/format';
import type { OrderLine } from '../orders.types';

/** Where a line's units stand: held for the order, shipped, or not tracked. */
function LineStock({ line }: { line: OrderLine }) {
  if (!line.variantId) {
    return <span className="text-warning">Not in your catalog; stock not tracked</span>;
  }
  const parts = [];
  if (line.reservedQuantity > 0) parts.push(`${line.reservedQuantity} reserved`);
  if (line.fulfilledQuantity > 0) parts.push(`${line.fulfilledQuantity} shipped`);
  return <span className="text-muted-foreground">{parts.join(' · ') || 'Nothing held'}</span>;
}

/** The order's lines, each with the stock it holds in Crossmart. */
export function OrderLinesTable({ lines, currency }: { lines: OrderLine[]; currency: string }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="w-20 text-right">Qty</TableHead>
            <TableHead className="hidden w-28 text-right sm:table-cell">Price</TableHead>
            <TableHead className="hidden w-56 md:table-cell">Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line) => (
            <TableRow key={line.id}>
              <TableCell className="whitespace-normal">
                <div className="flex flex-col gap-0.5">
                  {line.productId ? (
                    <Link
                      to={toProductRoute(line.productId)}
                      className="font-medium hover:underline"
                    >
                      {line.title}
                    </Link>
                  ) : (
                    <span className="font-medium">{line.title}</span>
                  )}
                  {line.sku && (
                    <span className="font-mono text-xs text-muted-foreground">{line.sku}</span>
                  )}
                  <span className="text-xs md:hidden">
                    <LineStock line={line} />
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums">{line.quantity}</TableCell>
              <TableCell className="hidden text-right tabular-nums sm:table-cell">
                {formatMoney(line.unitPrice, currency)}
              </TableCell>
              <TableCell className="hidden text-sm md:table-cell">
                <LineStock line={line} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
