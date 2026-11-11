import { SuggestionAgent, SuggestionKind, SuggestionStatus } from '@/api/schema';
import type { FilterTab } from '@/components/lists/FilterTabs';

export const SUGGESTIONS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/suggestions';
export const APPROVE_SUGGESTION_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/suggestions/{suggestionId}/approve';
export const REJECT_SUGGESTION_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/suggestions/{suggestionId}/reject';
export const BULK_APPROVE_ENDPOINT = '/api/v1/workspaces/{workspaceId}/suggestions/bulk-approve';
export const AI_STATUS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/ai/status';
export const CONTENT_GENERATIONS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/ai/content-generations';

/** Products one generation request may name; the API allows no more. */
export const CONTENT_GENERATION_BATCH_SIZE = 100;
/** Suggestions one bulk approval may name; the API allows no more, and it matches a page. */
export const BULK_APPROVE_MAX = 100;
/** Whether AI is configured changes only with a server restart. */
export const AI_STATUS_STALE_MS = 300_000;

export const SUGGESTION_KIND_LABELS: Record<SuggestionKind, string> = {
  [SuggestionKind.listing_title]: 'Title',
  [SuggestionKind.listing_description]: 'Description',
};

export const SUGGESTION_AGENT_LABELS: Record<SuggestionAgent, string> = {
  [SuggestionAgent.content_generator]: 'Content Generator',
};

export const SUGGESTION_STATUS_LABELS: Record<SuggestionStatus, string> = {
  [SuggestionStatus.PENDING]: 'Pending',
  [SuggestionStatus.APPLIED]: 'Applied',
  [SuggestionStatus.REJECTED]: 'Rejected',
  [SuggestionStatus.STALE]: 'Outdated',
};

/** The inbox's tabs; pending first, as that is the work to do. */
export const SUGGESTION_STATUS_TABS: readonly FilterTab<SuggestionStatus>[] = [
  SuggestionStatus.PENDING,
  SuggestionStatus.APPLIED,
  SuggestionStatus.REJECTED,
  SuggestionStatus.STALE,
].map((status) => ({ value: status, label: SUGGESTION_STATUS_LABELS[status] }));

/** Kinds whose values are HTML, compared and previewed as text. */
export const HTML_SUGGESTION_KINDS: ReadonlySet<SuggestionKind> = new Set([
  SuggestionKind.listing_description,
]);

export const SUGGESTIONS_FEEDBACK = {
  approved: 'Applied to the store’s listing',
  stale: 'Not applied: this field changed since the suggestion was made',
  rejected: 'Suggestion rejected',
  generating: 'Writing with AI. Suggestions will appear in your inbox shortly.',
} as const;

export const AI_COPY = {
  notConfiguredTitle: 'AI is not configured',
  notConfiguredDescription:
    'Set ANTHROPIC_API_KEY on the server and restart it to turn on AI content and suggestions.',
  generate: 'Generate with AI',
} as const;

/** Pending suggestions a product's page loads at once: more than one product ever gathers. */
export const PRODUCT_SUGGESTIONS_LIMIT = 50;
