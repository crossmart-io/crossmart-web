import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { api, fetchClient } from '@/api/client';
import { endpointQueryKey } from '@/api/query-keys';
import type { components } from '@/api/schema';
import {
  AGENT_CONNECTION_ENDPOINT,
  AGENT_CONNECTIONS_ENDPOINT,
  AGENT_FEEDBACK,
} from '../agents.constants';

export type AgentConnection = components['schemas']['AgentConnectionDto'];

export function useAgentConnections(workspaceId: string) {
  return api.useQuery('get', AGENT_CONNECTIONS_ENDPOINT, { params: { path: { workspaceId } } });
}

export function useDisconnectAgent(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    meta: { successMessage: AGENT_FEEDBACK.disconnected },
    mutationFn: async (connectionId) => {
      const { error } = await fetchClient.DELETE(AGENT_CONNECTION_ENDPOINT, {
        params: { path: { workspaceId, connectionId } },
      });
      if (error) throw ApiRequestError.from(error);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: endpointQueryKey(AGENT_CONNECTIONS_ENDPOINT) }),
  });
}
