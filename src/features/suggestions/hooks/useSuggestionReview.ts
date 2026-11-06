import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import { SuggestionStatus } from '@/api/schema';
import { useInvalidateCatalog } from '@/features/catalog';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { PRODUCT_CHANNELS_ENDPOINT } from '@/features/listings/listings.constants';
import { chunk } from '@/lib/chunk';
import { pluralize } from '@/lib/format';
import {
  APPROVE_SUGGESTION_ENDPOINT,
  BULK_APPROVE_ENDPOINT,
  BULK_APPROVE_MAX,
  REJECT_SUGGESTION_ENDPOINT,
  SUGGESTIONS_ENDPOINT,
  SUGGESTIONS_FEEDBACK,
} from '../suggestions.constants';
import type { BulkReviewResult, Suggestion } from '../suggestions.types';

/** Approving changes what a store shows, so the product's channels are refreshed too. */
const REVIEW_ENDPOINTS = [SUGGESTIONS_ENDPOINT, PRODUCT_CHANNELS_ENDPOINT] as const;

/** Approving reports whether it applied, or found the field changed since. */
function announceApproval(suggestion: Suggestion): void {
  if (suggestion.status === SuggestionStatus.STALE) toast.warning(SUGGESTIONS_FEEDBACK.stale);
  else toast.success(SUGGESTIONS_FEEDBACK.approved);
}

function announceBulk({ items }: BulkReviewResult): void {
  const applied = items.filter((item) => item.status === SuggestionStatus.APPLIED).length;
  const stale = items.length - applied;
  const staleNote = stale > 0 ? `; ${stale} had changed and were not applied` : '';
  toast.success(`Applied ${pluralize(applied, 'suggestion')}${staleNote}`);
}

/** A suggestion without a store edits the product itself, so the catalog shows it too. */
function changesProduct(suggestion: Suggestion): boolean {
  return suggestion.connection === null && suggestion.status === SuggestionStatus.APPLIED;
}

/** Approves in batches the API accepts, and reports them as one result. */
async function approveInBatches(
  workspaceId: string,
  suggestionIds: readonly string[],
): Promise<BulkReviewResult> {
  const result: BulkReviewResult = { items: [], skippedIds: [] };
  for (const batch of chunk(suggestionIds, BULK_APPROVE_MAX)) {
    const reviewed = await unwrap(
      fetchClient.POST(BULK_APPROVE_ENDPOINT, {
        params: { path: { workspaceId } },
        body: { suggestionIds: batch },
      }),
    );
    result.items.push(...reviewed.items);
    result.skippedIds.push(...reviewed.skippedIds);
  }
  return result;
}

/** Approves or rejects one suggestion of the workspace. */
export function useSuggestionReview(workspaceId: string) {
  const refresh = useInvalidateEndpoints(REVIEW_ENDPOINTS);
  const refreshCatalog = useInvalidateCatalog();
  const approve = useMutation<Suggestion, Error, string>({
    mutationFn: (suggestionId) =>
      unwrap(
        fetchClient.POST(APPROVE_SUGGESTION_ENDPOINT, {
          params: { path: { workspaceId, suggestionId } },
        }),
      ),
    onSuccess: async (suggestion) => {
      announceApproval(suggestion);
      if (changesProduct(suggestion)) await refreshCatalog();
    },
    onSettled: refresh,
  });
  const reject = useMutation<Suggestion, Error, string>({
    meta: { successMessage: SUGGESTIONS_FEEDBACK.rejected },
    mutationFn: (suggestionId) =>
      unwrap(
        fetchClient.POST(REJECT_SUGGESTION_ENDPOINT, {
          params: { path: { workspaceId, suggestionId } },
        }),
      ),
    onSettled: refresh,
  });
  return { approve, reject };
}

/**
 * Approves many pending suggestions, in as many requests as the API's limit needs; the ones no
 * longer pending are skipped.
 */
export function useBulkApproveSuggestions(workspaceId: string) {
  const refresh = useInvalidateEndpoints(REVIEW_ENDPOINTS);
  const refreshCatalog = useInvalidateCatalog();
  return useMutation<BulkReviewResult, Error, string[]>({
    mutationFn: (suggestionIds) => approveInBatches(workspaceId, suggestionIds),
    onSuccess: async (result) => {
      announceBulk(result);
      if (result.items.some(changesProduct)) await refreshCatalog();
    },
    onSettled: refresh,
  });
}
