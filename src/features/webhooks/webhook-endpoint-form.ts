import type { WebhookEventType } from '@/api/schema';
import type { NewWebhookEndpoint, WebhookEndpoint } from './hooks/useWebhookEndpoints';

/** What the endpoint form holds while it is being filled in. */
export interface WebhookEndpointDraft {
  url: string;
  description: string;
  eventTypes: WebhookEventType[];
}

/** Why the draft cannot be sent yet, by field. */
export interface WebhookEndpointDraftErrors {
  url?: string;
  eventTypes?: string;
}

/** Schemes a receiver URL may use. The API also requires https in production. */
const URL_PROTOCOLS: ReadonlySet<string> = new Set(['https:', 'http:']);

export const DRAFT_ERRORS = {
  urlRequired: 'Enter the URL that should receive events.',
  urlInvalid: 'Enter a full URL, such as https://example.com/webhooks.',
  eventsRequired: 'Pick at least one event.',
} as const;

export function draftOf(endpoint?: WebhookEndpoint): WebhookEndpointDraft {
  return {
    url: endpoint?.url ?? '',
    description: endpoint?.description ?? '',
    eventTypes: endpoint ? [...endpoint.eventTypes] : [],
  };
}

function urlErrorOf(url: string): string | undefined {
  if (!url) return DRAFT_ERRORS.urlRequired;
  if (!URL.canParse(url)) return DRAFT_ERRORS.urlInvalid;
  return URL_PROTOCOLS.has(new URL(url).protocol) ? undefined : DRAFT_ERRORS.urlInvalid;
}

/** The draft's problems, checked before sending; the API checks the address itself. */
export function validateDraft(draft: WebhookEndpointDraft): WebhookEndpointDraftErrors {
  return {
    url: urlErrorOf(draft.url.trim()),
    eventTypes: draft.eventTypes.length === 0 ? DRAFT_ERRORS.eventsRequired : undefined,
  };
}

export function hasDraftErrors(errors: WebhookEndpointDraftErrors): boolean {
  return Boolean(errors.url ?? errors.eventTypes);
}

export function toEndpointBody(draft: WebhookEndpointDraft): NewWebhookEndpoint {
  return {
    url: draft.url.trim(),
    description: draft.description.trim() || null,
    eventTypes: draft.eventTypes,
  };
}
