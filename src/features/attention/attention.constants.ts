import { AttentionStoreReason } from '@/api/schema';

export const ATTENTION_ENDPOINT = '/api/v1/workspaces/{workspaceId}/attention';

/** How many of each kind Home lists; the counts always cover everything. */
export const ATTENTION_LIST_LIMIT = 5;

/** Badges and Home check again this often, as the pending-review counts did. */
export const ATTENTION_REFRESH_MS = 30_000;

/** What each store row says about the store. */
export const STORE_REASON_COPY: Record<AttentionStoreReason, string> = {
  [AttentionStoreReason.needs_reauth]: 'Needs reconnecting',
  [AttentionStoreReason.error]: 'Has a connection error',
  [AttentionStoreReason.disconnected_with_listings]: 'Disconnected with listings still live',
};

export const ATTENTION_COPY = {
  title: 'Needs attention',
  allGood: 'All good. Nothing needs you right now.',
  reconnect: 'Reconnect',
  openStore: 'Open store',
  fix: 'Fix',
  review: 'Review',
  failedFallback: 'The store refused this listing',
  proposals: (count: number) =>
    count === 1 ? '1 change from an outside agent' : `${count} changes from outside agents`,
  suggestions: (count: number) =>
    count === 1 ? '1 AI suggestion' : `${count.toLocaleString()} AI suggestions`,
  waitingForYou: 'Waiting for your approval',
  moreStores: (count: number) => `${count} more ${count === 1 ? 'store' : 'stores'}`,
  moreListings: (count: number) => `All ${count.toLocaleString()} failed listings`,
} as const;
