import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { HttpStatus, statusCodeOf, toApiErrorMessage } from '@/api/api-error';
import { api, fetchClient } from '@/api/client';
import type { AskEscalationStatus } from '@/api/schema';
import { unwrap } from '@/api/unwrap';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  ASK_ESCALATION_FEEDBACK,
  ASK_ESCALATION_LIST_LIMIT,
  ASK_ESCALATION_QUERIES,
  ASK_ESCALATION_REPLY_ENDPOINT,
  ASK_ESCALATIONS_ENDPOINT,
} from '../ask-insights.constants';
import type { AskEscalationRecord } from '../ask-insights.types';

/** Escalations, newest first, optionally of one status. */
export function useAskEscalations(status: AskEscalationStatus | undefined) {
  return api.useQuery(
    'get',
    ASK_ESCALATIONS_ENDPOINT,
    { params: { query: { status, limit: ASK_ESCALATION_LIST_LIMIT } } },
    { staleTime: 0 },
  );
}

/**
 * Answers an escalation once: the API emails the reply and POSTs it to the callback. When
 * another admin replied first (409), the conversation reloads to show their reply.
 */
export function useReplyToAskEscalation(escalationId: string) {
  const refresh = useInvalidateEndpoints(ASK_ESCALATION_QUERIES);
  return useMutation<AskEscalationRecord, Error, string>({
    meta: { inlineError: true, successMessage: ASK_ESCALATION_FEEDBACK.replied },
    mutationFn: (reply) =>
      unwrap(
        fetchClient.POST(ASK_ESCALATION_REPLY_ENDPOINT, {
          params: { path: { escalationId } },
          body: { reply },
        }),
      ),
    onSuccess: refresh,
    onError: async (error) => {
      if (statusCodeOf(error) !== HttpStatus.Conflict) {
        toast.error(toApiErrorMessage(error));
        return;
      }
      toast.warning(ASK_ESCALATION_FEEDBACK.alreadyReplied);
      await refresh();
    },
  });
}
