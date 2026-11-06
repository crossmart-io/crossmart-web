import type { ListingDisplayState } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LISTING_STATE_PRESENTATION } from '../listing-states';

/** Where a product stands on one store: words, an icon and a colour, from the server's state. */
export function ListingStateBadge({ state }: { state: ListingDisplayState }) {
  const { label, icon: Icon, tone, spinning } = LISTING_STATE_PRESENTATION[state];
  return (
    <Badge variant={tone} data-state={state}>
      <Icon
        data-icon="inline-start"
        className={cn(spinning && 'motion-safe:animate-spin')}
        aria-hidden="true"
      />
      {label}
    </Badge>
  );
}
