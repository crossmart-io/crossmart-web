import { OrderStatus } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { ORDER_STATUS_LABELS } from '../orders.constants';

type OrderBadgeVariant = 'success' | 'outline' | 'secondary';

const BADGE_VARIANTS = {
  [OrderStatus.OPEN]: 'outline',
  [OrderStatus.PARTIALLY_FULFILLED]: 'outline',
  [OrderStatus.FULFILLED]: 'success',
  [OrderStatus.CANCELLED]: 'secondary',
} as const satisfies Record<OrderStatus, OrderBadgeVariant>;

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={BADGE_VARIANTS[status]}>
      <span data-dot className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
