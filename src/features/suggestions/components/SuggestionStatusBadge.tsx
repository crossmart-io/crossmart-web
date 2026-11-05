import { SuggestionStatus } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { SUGGESTION_STATUS_LABELS } from '../suggestions.constants';

type SuggestionBadgeVariant = 'success' | 'warning' | 'outline' | 'secondary';

const BADGE_VARIANTS = {
  [SuggestionStatus.PENDING]: 'secondary',
  [SuggestionStatus.APPLIED]: 'success',
  [SuggestionStatus.REJECTED]: 'outline',
  [SuggestionStatus.STALE]: 'warning',
} as const satisfies Record<SuggestionStatus, SuggestionBadgeVariant>;

export function SuggestionStatusBadge({ status }: { status: SuggestionStatus }) {
  return (
    <Badge variant={BADGE_VARIANTS[status]}>
      <span data-dot className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {SUGGESTION_STATUS_LABELS[status]}
    </Badge>
  );
}
