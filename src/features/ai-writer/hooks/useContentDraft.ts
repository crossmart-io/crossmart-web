import { useMutation } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
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
    mutationFn: ({ fields, instruction, current }) =>
      unwrap(
        fetchClient.POST(CONTENT_DRAFTS_ENDPOINT, {
          params: { path: { workspaceId } },
          body: {
            productId,
            connectionId,
            fields: [...fields],
            instruction: instruction.trim() || undefined,
            ...current,
          },
        }),
      ),
  });
}
