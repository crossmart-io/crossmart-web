import { useMutation } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { fetchClient } from '@/api/client';
import type { ContentField } from '@/api/schema';
import { CONTENT_DRAFTS_ENDPOINT } from '../ai-writer.constants';
import type { ContentDraft, ContentDraftCurrent, ContentDraftTarget } from '../ai-writer.types';

interface ContentDraftInput {
  fields: readonly ContentField[];
  instruction: string;
  current: ContentDraftCurrent;
}

/** Asks AI to rewrite fields right away. Errors stay in the popover, not in a toast. */
export function useContentDraft({ workspaceId, productId, connectionId }: ContentDraftTarget) {
  return useMutation<ContentDraft, Error, ContentDraftInput>({
    meta: { inlineError: true },
    mutationFn: async ({ fields, instruction, current }) => {
      const { data, error } = await fetchClient.POST(CONTENT_DRAFTS_ENDPOINT, {
        params: { path: { workspaceId } },
        body: {
          productId,
          connectionId,
          fields: [...fields],
          instruction: instruction.trim() || undefined,
          ...current,
        },
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
  });
}
