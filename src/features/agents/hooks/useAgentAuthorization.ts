import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { authClient } from '@/api/auth-client';
import { fetchClient } from '@/api/client';
import { AuthRequestError } from '@/features/auth';
import { AGENT_WORKSPACE_ENDPOINT, UNNAMED_AGENT } from '../agents.constants';

const AGENT_CLIENT_QUERY_KEY = 'agent-client';

/** The agent's public details (name, home page, logo) as its metadata gives them. */
export function useAgentClient(clientId: string | null) {
  return useQuery({
    queryKey: [AGENT_CLIENT_QUERY_KEY, clientId],
    enabled: clientId !== null,
    queryFn: async () => {
      const { data, error } = await authClient.oauth2.publicClient({
        query: { client_id: clientId ?? '' },
      });
      if (error) throw AuthRequestError.from(error);
      return data;
    },
  });
}

/** The agent's name for headings, once known. */
export function useAgentName(clientId: string | null): string {
  return useAgentClient(clientId).data?.client_name ?? UNNAMED_AGENT;
}

/**
 * Saves the workspace for the agent, then continues its authorization. Better Auth answers with
 * where to go next (consent, or the agent itself) and the auth client goes there.
 */
export function usePickAgentWorkspace() {
  return useMutation<void, Error, string>({
    meta: { inlineError: true },
    mutationFn: async (workspaceId) => {
      const picked = await fetchClient.POST(AGENT_WORKSPACE_ENDPOINT, { body: { workspaceId } });
      if (!picked.response.ok) throw ApiRequestError.from(picked.error);
      const { error } = await authClient.oauth2.continue({ postLogin: true });
      if (error) throw AuthRequestError.from(error);
    },
  });
}

export interface AgentConsentDecision {
  accept: boolean;
  /** The scopes accepted; all requested ones when absent. */
  scope?: string;
}

/** Answers the agent's request; Better Auth then sends the browser back to the agent. */
export function useAgentConsent() {
  return useMutation<void, Error, AgentConsentDecision>({
    meta: { inlineError: true },
    mutationFn: async (decision) => {
      const { error } = await authClient.oauth2.consent(decision);
      if (error) throw AuthRequestError.from(error);
    },
  });
}
