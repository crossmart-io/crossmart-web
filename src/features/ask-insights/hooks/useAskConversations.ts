import { api, fetchClient } from '@/api/client';
import type { AskChannel, AskOutcome } from '@/api/schema';
import { unwrap } from '@/api/unwrap';
import { usePagedList } from '@/hooks/usePagedList';
import type { Pagination } from '@/hooks/usePagination';
import { ASK_CONVERSATION_ENDPOINT, ASK_CONVERSATIONS_ENDPOINT } from '../ask-insights.constants';
import {
  type AskConversationPage,
  type AskConversationSummary,
  type DayRange,
  EscalatedFilter,
} from '../ask-insights.types';
import { toInstantRange } from '../day-range';

export interface ConversationsQuery {
  outcome?: AskOutcome;
  channel?: AskChannel;
  escalated?: EscalatedFilter;
  range: DayRange;
}

function toEscalatedParam(escalated: EscalatedFilter | undefined): boolean | undefined {
  return escalated === undefined ? undefined : escalated === EscalatedFilter.Escalated;
}

/** One numbered page of stored conversations, newest first. Refetched on each visit. */
export function useAskConversations(
  { outcome, channel, escalated, range }: ConversationsQuery,
  pagination: Pagination,
) {
  const query = {
    outcome,
    channel,
    escalated: toEscalatedParam(escalated),
    ...toInstantRange(range),
  };
  return usePagedList<AskConversationSummary, AskConversationPage>({
    endpoint: ASK_CONVERSATIONS_ENDPOINT,
    params: query,
    pagination,
    fetchPage: (page, signal) =>
      unwrap(
        fetchClient.GET(ASK_CONVERSATIONS_ENDPOINT, {
          params: { query: { ...query, ...page } },
          signal,
        }),
      ),
    staleTime: 0,
  });
}

/** One conversation with every question, answer and escalation. */
export function useAskConversation(conversationId: string) {
  return api.useQuery('get', ASK_CONVERSATION_ENDPOINT, {
    params: { path: { conversationId } },
  });
}
