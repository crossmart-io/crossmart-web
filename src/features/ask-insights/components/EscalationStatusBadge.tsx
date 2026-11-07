import { AskEscalationStatus } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { ASK_ESCALATION_STATUS_LABELS } from '../ask-insights.constants';

const BADGE_VARIANTS = {
  [AskEscalationStatus.open]: 'warning',
  [AskEscalationStatus.replied]: 'success',
} as const satisfies Record<AskEscalationStatus, 'warning' | 'success'>;

export function EscalationStatusBadge({ status }: { status: AskEscalationStatus }) {
  return (
    <Badge variant={BADGE_VARIANTS[status]}>
      <span data-dot className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {ASK_ESCALATION_STATUS_LABELS[status]}
    </Badge>
  );
}
