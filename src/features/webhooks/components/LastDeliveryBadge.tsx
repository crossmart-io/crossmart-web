import { WebhookAttemptOutcome } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import type { WebhookLastDelivery } from '../hooks/useWebhookEndpoints';
import { ATTEMPT_OUTCOME_LABELS, LAST_DELIVERY_COPY } from '../webhooks.constants';

const BADGE_VARIANTS = {
  [WebhookAttemptOutcome.SUCCEEDED]: 'success',
  [WebhookAttemptOutcome.FAILED]: 'destructive',
} as const satisfies Record<WebhookAttemptOutcome, 'success' | 'destructive'>;

/** Delivered or failed, with the HTTP status a failing endpoint answered and why on hover. */
export function LastDeliveryBadge({ lastDelivery }: { lastDelivery: WebhookLastDelivery }) {
  const { outcome, responseStatus, error } = lastDelivery;
  const showStatus = outcome === WebhookAttemptOutcome.FAILED && responseStatus !== null;
  return (
    <Badge variant={BADGE_VARIANTS[outcome]} title={error ?? undefined}>
      <span data-dot className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {ATTEMPT_OUTCOME_LABELS[outcome]}
      {showStatus && <span>· {LAST_DELIVERY_COPY.responseStatus(responseStatus)}</span>}
    </Badge>
  );
}
