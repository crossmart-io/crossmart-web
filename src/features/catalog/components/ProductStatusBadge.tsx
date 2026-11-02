import { ProductStatus } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { PRODUCT_STATUS_LABELS } from '../product-status';

const BADGE_VARIANTS = {
  [ProductStatus.ACTIVE]: 'default',
  [ProductStatus.DRAFT]: 'secondary',
  [ProductStatus.ARCHIVED]: 'outline',
} as const satisfies Record<ProductStatus, 'default' | 'secondary' | 'outline'>;

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return <Badge variant={BADGE_VARIANTS[status]}>{PRODUCT_STATUS_LABELS[status]}</Badge>;
}
