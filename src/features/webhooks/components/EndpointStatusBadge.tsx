import { Badge } from '@/components/ui/badge';
import type { WebhookEndpoint } from '../hooks/useWebhookEndpoints';
import { endpointStateOf } from '../webhook-endpoint-state';
import { ENDPOINT_STATE_LABELS, WebhookEndpointState } from '../webhooks.constants';

const BADGE_VARIANTS = {
  [WebhookEndpointState.Enabled]: 'success',
  [WebhookEndpointState.Off]: 'secondary',
  [WebhookEndpointState.Failing]: 'destructive',
} as const satisfies Record<WebhookEndpointState, 'success' | 'secondary' | 'destructive'>;

/** On, off, or turned off by Crossmart after failing deliveries. */
export function EndpointStatusBadge({ endpoint }: { endpoint: WebhookEndpoint }) {
  const state = endpointStateOf(endpoint);
  return (
    <Badge variant={BADGE_VARIANTS[state]}>
      <span data-dot className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {ENDPOINT_STATE_LABELS[state]}
    </Badge>
  );
}
