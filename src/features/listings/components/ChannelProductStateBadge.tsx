import { ChannelProductState } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { CHANNEL_PRODUCT_STATE_LABELS } from '../listings.constants';

type StateBadgeVariant = 'success' | 'warning' | 'destructive' | 'outline' | 'secondary';

const BADGE_VARIANTS = {
  [ChannelProductState.listed]: 'success',
  [ChannelProductState.pending]: 'secondary',
  [ChannelProductState.failed]: 'destructive',
  [ChannelProductState.removing]: 'warning',
  [ChannelProductState.excluded]: 'outline',
} as const satisfies Record<ChannelProductState, StateBadgeVariant>;

export function ChannelProductStateBadge({ state }: { state: ChannelProductState }) {
  return (
    <Badge variant={BADGE_VARIANTS[state]}>
      <span data-dot className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {CHANNEL_PRODUCT_STATE_LABELS[state]}
    </Badge>
  );
}
