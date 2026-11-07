import { useMutation } from '@tanstack/react-query';
import { api, fetchClient } from '@/api/client';
import { unwrap } from '@/api/unwrap';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  AGENT_WORKER_CANCEL_ENDPOINT,
  AGENT_WORKER_CONVERSATION_ENDPOINT,
  AGENT_WORKER_CONVERSATIONS_ENDPOINT,
  AGENT_WORKER_HISTORY_LIMIT,
} from '../agent-worker.constants';
import type { AgentWorkerConversation } from '../agent-worker.types';

const CONVERSATION_LIST_ENDPOINTS = [AGENT_WORKER_CONVERSATIONS_ENDPOINT];

/** The person's latest conversations, for the history switcher. Loads only while `enabled`. */
export function useAgentWorkerConversations(workspaceId: string, enabled: boolean) {
  return api.useQuery(
    'get',
    AGENT_WORKER_CONVERSATIONS_ENDPOINT,
    { params: { path: { workspaceId }, query: { limit: AGENT_WORKER_HISTORY_LIMIT } } },
    { enabled },
  );
}

/** One conversation with its messages; nothing loads until one is picked. */
export function useAgentWorkerConversation(workspaceId: string, conversationId: string | null) {
  return api.useQuery(
    'get',
    AGENT_WORKER_CONVERSATION_ENDPOINT,
    { params: { path: { workspaceId, conversationId: conversationId ?? '' } } },
    { enabled: conversationId !== null },
  );
}

/** Starts a conversation; its title comes from the first message. */
export function useCreateAgentWorkerConversation(workspaceId: string) {
  const refresh = useInvalidateEndpoints(CONVERSATION_LIST_ENDPOINTS);
  return useMutation<AgentWorkerConversation, Error, void>({
    mutationFn: () =>
      unwrap(
        fetchClient.POST(AGENT_WORKER_CONVERSATIONS_ENDPOINT, {
          params: { path: { workspaceId } },
          body: {},
        }),
      ),
    onSuccess: refresh,
  });
}

/** Asks the API to stop the running turn of a conversation. */
export function useCancelAgentWorkerTurn(workspaceId: string) {
  return useMutation<unknown, Error, string>({
    mutationFn: (conversationId) =>
      unwrap(
        fetchClient.POST(AGENT_WORKER_CANCEL_ENDPOINT, {
          params: { path: { workspaceId, conversationId } },
        }),
      ),
  });
}
