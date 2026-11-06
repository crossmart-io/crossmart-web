import { WebhookDisabledReason } from '@/api/schema';
import type { WebhookEndpoint } from './hooks/useWebhookEndpoints';
import { WebhookEndpointState } from './webhooks.constants';

/** Where the endpoint stands: on, turned off by someone, or turned off by Crossmart. */
export function endpointStateOf(
  endpoint: Pick<WebhookEndpoint, 'enabled' | 'disabledReason'>,
): WebhookEndpointState {
  if (endpoint.enabled) return WebhookEndpointState.Enabled;
  return endpoint.disabledReason === WebhookDisabledReason.FAILING
    ? WebhookEndpointState.Failing
    : WebhookEndpointState.Off;
}
