import { useMutation } from '@tanstack/react-query';
import { fetchClient } from '@/api/client';
import { AskChannel } from '@/api/schema';
import { unwrap } from '@/api/unwrap';
import { useCurrentWorkspace } from '@/features/workspaces';
import { ASK_ENDPOINT } from '../ask.constants';
import type { AskAnswer, AskRequest } from '../ask.types';

/**
 * Sends one question to Ask Crossmart from the app's widget, with the workspace the user is in,
 * so Ask can also answer about it. Errors stay in the panel, not in a toast.
 */
export function useAskQuestion() {
  const workspaceId = useCurrentWorkspace().workspace?.id;
  return useMutation<AskAnswer, Error, AskRequest>({
    meta: { inlineError: true },
    mutationFn: ({ question, conversationId }) =>
      unwrap(
        fetchClient.POST(ASK_ENDPOINT, {
          body: { question, conversationId, workspaceId, channel: AskChannel.app_widget },
        }),
      ),
  });
}
