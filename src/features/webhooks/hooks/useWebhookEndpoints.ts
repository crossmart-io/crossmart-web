import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, fetchClient } from '@/api/client';
import type { components } from '@/api/schema';
import { unwrap } from '@/api/unwrap';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  WEBHOOK_DELIVERIES_ENDPOINT,
  WEBHOOK_ENDPOINT_ENDPOINT,
  WEBHOOK_ENDPOINT_QUERIES,
  WEBHOOK_ENDPOINTS_ENDPOINT,
  WEBHOOK_FEEDBACK,
  WEBHOOK_ROTATE_SECRET_ENDPOINT,
  WEBHOOK_TEST_ENDPOINT,
} from '../webhooks.constants';

export type WebhookEndpoint = components['schemas']['WebhookEndpointDto'];
export type WebhookLastDelivery = components['schemas']['WebhookEndpointLastDeliveryDto'];
export type WebhookEndpointWithSecret = components['schemas']['WebhookEndpointWithSecretDto'];
export type NewWebhookEndpoint = components['schemas']['CreateWebhookEndpointDto'];
export type WebhookEndpointChanges = components['schemas']['UpdateWebhookEndpointDto'];
export type WebhookDelivery = components['schemas']['WebhookDeliveryDto'];

/** One endpoint of the workspace, as every mutation on it is addressed. */
export interface WebhookEndpointRef {
  workspaceId: string;
  endpointId: string;
}

const LIST_QUERY = [WEBHOOK_ENDPOINTS_ENDPOINT];
/** A test event adds a delivery and changes the endpoint's last delivery and failure count. */
const TEST_QUERIES = [...WEBHOOK_ENDPOINT_QUERIES, WEBHOOK_DELIVERIES_ENDPOINT];

export function useWebhookEndpoints(workspaceId: string) {
  return api.useQuery('get', WEBHOOK_ENDPOINTS_ENDPOINT, { params: { path: { workspaceId } } });
}

export function useWebhookEndpoint(ref: WebhookEndpointRef) {
  return api.useQuery('get', WEBHOOK_ENDPOINT_ENDPOINT, { params: { path: ref } });
}

/** Adds an endpoint. The answer holds its secret, which the API never returns again. */
export function useCreateWebhookEndpoint(workspaceId: string) {
  const refresh = useInvalidateEndpoints(WEBHOOK_ENDPOINT_QUERIES);
  return useMutation<WebhookEndpointWithSecret, Error, NewWebhookEndpoint>({
    meta: { inlineError: true },
    mutationFn: (body) =>
      unwrap(
        fetchClient.POST(WEBHOOK_ENDPOINTS_ENDPOINT, { params: { path: { workspaceId } }, body }),
      ),
    onSuccess: refresh,
  });
}

function patchEndpoint(ref: WebhookEndpointRef, body: WebhookEndpointChanges) {
  return unwrap(fetchClient.PATCH(WEBHOOK_ENDPOINT_ENDPOINT, { params: { path: ref }, body }));
}

/** Changes the URL, description or events, from the form that shows its own errors. */
export function useEditWebhookEndpoint(ref: WebhookEndpointRef) {
  const refresh = useInvalidateEndpoints(WEBHOOK_ENDPOINT_QUERIES);
  return useMutation<WebhookEndpoint, Error, WebhookEndpointChanges>({
    meta: { inlineError: true },
    mutationFn: (changes) => patchEndpoint(ref, changes),
    onSuccess: refresh,
  });
}

/** Turns the endpoint on (which clears its failures) or off. */
export function useSetWebhookEndpointEnabled(ref: WebhookEndpointRef) {
  const refresh = useInvalidateEndpoints(WEBHOOK_ENDPOINT_QUERIES);
  return useMutation<WebhookEndpoint, Error, boolean>({
    mutationFn: (enabled) => patchEndpoint(ref, { enabled }),
    onSuccess: async (endpoint) => {
      toast.success(endpoint.enabled ? WEBHOOK_FEEDBACK.enabled : WEBHOOK_FEEDBACK.disabled);
      await refresh();
    },
  });
}

export function useDeleteWebhookEndpoint(ref: WebhookEndpointRef) {
  const refresh = useInvalidateEndpoints(LIST_QUERY);
  return useMutation<void, Error>({
    meta: { successMessage: WEBHOOK_FEEDBACK.deleted },
    mutationFn: async () => {
      await unwrap(fetchClient.DELETE(WEBHOOK_ENDPOINT_ENDPOINT, { params: { path: ref } }));
    },
    onSuccess: refresh,
  });
}

/** Issues a new secret, returned once; the old one keeps signing for a while. */
export function useRotateWebhookSecret(ref: WebhookEndpointRef) {
  const refresh = useInvalidateEndpoints(WEBHOOK_ENDPOINT_QUERIES);
  return useMutation<WebhookEndpointWithSecret, Error>({
    mutationFn: () =>
      unwrap(fetchClient.POST(WEBHOOK_ROTATE_SECRET_ENDPOINT, { params: { path: ref } })),
    onSuccess: refresh,
  });
}

/** Sends a `webhook.test` event to the endpoint, whatever it subscribes to. */
export function useSendWebhookTest(ref: WebhookEndpointRef) {
  const refresh = useInvalidateEndpoints(TEST_QUERIES);
  return useMutation<WebhookDelivery, Error>({
    meta: { successMessage: WEBHOOK_FEEDBACK.testSent },
    mutationFn: () => unwrap(fetchClient.POST(WEBHOOK_TEST_ENDPOINT, { params: { path: ref } })),
    onSuccess: refresh,
  });
}
