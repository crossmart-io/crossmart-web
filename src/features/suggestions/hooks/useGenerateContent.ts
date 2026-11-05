import { useMutation } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { fetchClient } from '@/api/client';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { chunk } from '@/lib/chunk';
import {
  CONTENT_GENERATION_BATCH_SIZE,
  CONTENT_GENERATIONS_ENDPOINT,
  SUGGESTIONS_ENDPOINT,
  SUGGESTIONS_FEEDBACK,
} from '../suggestions.constants';
import type { ContentGenerationReceipt } from '../suggestions.types';

interface ContentGenerationInput {
  connectionId: string;
  productIds: readonly string[];
}

const SUGGESTION_ENDPOINTS = [SUGGESTIONS_ENDPOINT] as const;

/**
 * Asks the Content Generator to write for products on one store, in batches the API takes.
 * The work runs in the background; its suggestions arrive in the inbox.
 */
export function useGenerateContent(workspaceId: string) {
  const refresh = useInvalidateEndpoints(SUGGESTION_ENDPOINTS);
  return useMutation<ContentGenerationReceipt, Error, ContentGenerationInput>({
    meta: { successMessage: SUGGESTIONS_FEEDBACK.generating },
    mutationFn: async ({ connectionId, productIds }) => {
      let queued = 0;
      for (const batch of chunk(productIds, CONTENT_GENERATION_BATCH_SIZE)) {
        const data = await unwrap(
          fetchClient.POST(CONTENT_GENERATIONS_ENDPOINT, {
            params: { path: { workspaceId } },
            body: { connectionId, productIds: batch },
          }),
        );
        queued += data.queued;
      }
      return { queued };
    },
    onSuccess: refresh,
  });
}
