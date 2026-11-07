import { api } from '@/api/client';
import { SuggestionStatus } from '@/api/schema';
import { PRODUCT_SUGGESTIONS_LIMIT, SUGGESTIONS_ENDPOINT } from '../suggestions.constants';
import type { Suggestion } from '../suggestions.types';

/** The id of the store a suggestion is for, or null for the product's own content. */
type StoreKey = string | null;

/** Pending suggestions for one product, in one request, grouped by the store each is for. */
export function useProductSuggestions(workspaceId: string, productId: string) {
  const query = api.useQuery('get', SUGGESTIONS_ENDPOINT, {
    params: {
      path: { workspaceId },
      query: { productId, status: SuggestionStatus.PENDING, limit: PRODUCT_SUGGESTIONS_LIMIT },
    },
  });
  const byStore = new Map<StoreKey, Suggestion[]>();
  for (const suggestion of query.data?.items ?? []) {
    const key = suggestion.connection?.id ?? null;
    byStore.set(key, [...(byStore.get(key) ?? []), suggestion]);
  }
  return { ...query, byStore };
}
