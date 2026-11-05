import { TriangleAlert } from 'lucide-react';
import { Link } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toOrderRoute } from '@/config/routes';
import { cn } from '@/lib/utils';
import { formatDateTime, formatMoney, pluralize } from '@/lib/format';
import type { OrderSummary } from '../orders.types';
import { OrderStatusBadge } from './OrderStatusBadge';

/** Orders from every store, newest first. Each number opens the order; narrow screens fold columns. */
export function OrdersTable({
  orders,
  isRefreshing,
}: {
  orders: OrderSummary[];
  isRefreshing: boolean;
}) {
  return (
    <div
      className={cn('rounded-lg border transition-opacity', isRefreshing && 'opacity-60')}
      aria-busy={isRefreshing}
    >
      <Table stickyHeader>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead className="hidden w-36 sm:table-cell">Status</TableHead>
            <TableHead className="hidden w-48 md:table-cell">Store</TableHead>
            <TableHead className="hidden w-24 lg:table-cell">Items</TableHead>
            <TableHead className="w-28 text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function OrderRow({ order }: { order: OrderSummary }) {
  return (
    // The order link stretches over the row, so the whole row opens the order.
    <TableRow className="relative">
      <TableCell>
        <div className="flex min-w-0 flex-col gap-0.5">
          <Link
            to={toOrderRoute(order.id)}
            className="font-medium after:absolute after:inset-0 hover:underline focus-visible:underline"
          >
            {order.name}
          </Link>
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatDateTime(order.placedAt)}
          </span>
          {order.unmatchedLines > 0 && (
            <span className="flex items-center gap-1 text-xs text-warning">
              <TriangleAlert className="size-3" aria-hidden="true" />
              {pluralize(order.unmatchedLines, 'line')} not in your catalog
            </span>
          )}
          <span className="text-xs text-muted-foreground sm:hidden">{order.storeName}</span>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <OrderStatusBadge status={order.status} />
      </TableCell>
      <TableCell className="hidden truncate text-muted-foreground md:table-cell">
        {order.storeName}
      </TableCell>
      <TableCell className="hidden text-muted-foreground tabular-nums lg:table-cell">
        {order.itemCount}
      </TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {formatMoney(order.total, order.currencyCode)}
      </TableCell>
    </TableRow>
  );
}
