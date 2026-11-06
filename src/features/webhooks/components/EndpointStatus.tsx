import type { WebhookEndpoint } from '../hooks/useWebhookEndpoints';
import { endpointStateOf } from '../webhook-endpoint-state';
import { WebhookEndpointState } from '../webhooks.constants';
import { pluralize } from '@/lib/format';
import { EndpointStatusBadge } from './EndpointStatusBadge';

/** The status badge, and for an endpoint Crossmart turned off, how many attempts failed. */
export function EndpointStatus({ endpoint }: { endpoint: WebhookEndpoint }) {
  const isFailing = endpointStateOf(endpoint) === WebhookEndpointState.Failing;
  return (
    <div className="flex flex-col items-start gap-1">
      <EndpointStatusBadge endpoint={endpoint} />
      {isFailing && (
        <span className="text-xs text-muted-foreground">
          {pluralize(endpoint.consecutiveFailures, 'failed attempt')} in a row
        </span>
      )}
    </div>
  );
}
