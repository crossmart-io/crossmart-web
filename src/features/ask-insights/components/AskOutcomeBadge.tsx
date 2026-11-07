import { AskOutcome } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { ASK_OUTCOME_LABELS } from '../ask-insights.constants';

const BADGE_VARIANTS = {
  [AskOutcome.answered]: 'success',
  [AskOutcome.unknown]: 'warning',
  [AskOutcome.out_of_scope]: 'secondary',
} as const satisfies Record<AskOutcome, 'success' | 'warning' | 'secondary'>;

export function AskOutcomeBadge({ outcome }: { outcome: AskOutcome }) {
  return <Badge variant={BADGE_VARIANTS[outcome]}>{ASK_OUTCOME_LABELS[outcome]}</Badge>;
}
