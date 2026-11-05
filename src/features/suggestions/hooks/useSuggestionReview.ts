import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import { SuggestionStatus } from '@/api/schema';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { PRODUCT_CHANNELS_ENDPOINT } from '@/features/listings/listings.constants';
import { pluralize } from '@/lib/format';
import {
  APPROVE_SUGGESTION_ENDPOINT,
  BULK_APPROVE_ENDPOINT,
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

/** Approves or rejects one suggestion of the workspace. */
export function useSuggestionReview(workspaceId: string) {
  const refresh = useInvalidateEndpoints(REVIEW_ENDPOINTS);
  const approve = useMutation<Suggestion, Error, string>({
    mutationFn: async (suggestionId) => {
      const { data, error } = await fetchClient.POST(APPROVE_SUGGESTION_ENDPOINT, {
        params: { path: { workspaceId, suggestionId } },
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: announceApproval,
    onSettled: refresh,
  });
  const reject = useMutation<Suggestion, Error, string>({
    meta: { successMessage: SUGGESTIONS_FEEDBACK.rejected },
    mutationFn: async (suggestionId) => {
      const { data, error } = await fetchClient.POST(REJECT_SUGGESTION_ENDPOINT, {
        params: { path: { workspaceId, suggestionId } },
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSettled: refresh,
  });
  return { approve, reject };
}

/** Approves many pending suggestions at once; the ones no longer pending are skipped. */
export function useBulkApproveSuggestions(workspaceId: string) {
  const refresh = useInvalidateEndpoints(REVIEW_ENDPOINTS);
  return useMutation<BulkReviewResult, Error, string[]>({
    mutationFn: async (suggestionIds) => {
      const { data, error } = await fetchClient.POST(BULK_APPROVE_ENDPOINT, {
        params: { path: { workspaceId } },
        body: { suggestionIds },
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: announceBulk,
    onSettled: refresh,
  });
}
