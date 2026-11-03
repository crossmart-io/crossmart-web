import { ListingStatus } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { LISTING_STATUS_LABELS } from '../listings.constants';

type ListingBadgeVariant = 'success' | 'warning' | 'destructive' | 'outline' | 'secondary';

const BADGE_VARIANTS = {
  [ListingStatus.ACTIVE]: 'success',
  [ListingStatus.PENDING]: 'secondary',
  [ListingStatus.INACTIVE]: 'outline',
  [ListingStatus.ERROR]: 'destructive',
  [ListingStatus.DELISTED]: 'outline',
} as const satisfies Record<ListingStatus, ListingBadgeVariant>;

export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  return (
    <Badge variant={BADGE_VARIANTS[status]}>
      <span data-dot className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {LISTING_STATUS_LABELS[status]}
    </Badge>
  );
}
