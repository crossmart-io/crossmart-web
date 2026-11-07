import { RelativeTime } from '@/components/time/RelativeTime';
import { pluralize } from '@/lib/format';
import type { WebhookEndpoint } from '../hooks/useWebhookEndpoints';
import { LAST_DELIVERY_COPY } from '../webhooks.constants';
import { LastDeliveryBadge } from './LastDeliveryBadge';

type EndpointDeliveryHealth = Pick<WebhookEndpoint, 'lastDelivery' | 'consecutiveFailures'>;

/** How the endpoint's latest attempt ended and when, and how many attempts in a row failed. */
export function EndpointLastDelivery({ endpoint }: { endpoint: EndpointDeliveryHealth }) {
  const { lastDelivery, consecutiveFailures } = endpoint;
  return (
    <div className="flex flex-col items-start gap-1">
      {lastDelivery ? (
        <>
          <LastDeliveryBadge lastDelivery={lastDelivery} />
          <RelativeTime
            value={lastDelivery.attemptedAt}
            className="text-xs text-muted-foreground"
          />
        </>
      ) : (
        <span className="text-sm text-muted-foreground">{LAST_DELIVERY_COPY.none}</span>
      )}
      {consecutiveFailures > 0 && (
        <span className="text-xs text-destructive">
          {pluralize(consecutiveFailures, LAST_DELIVERY_COPY.failedAttempt)}{' '}
          {LAST_DELIVERY_COPY.failuresInARow}
        </span>
      )}
    </div>
  );
}
