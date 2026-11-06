import { useMutation } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { authClient } from '@/api/auth-client';
import { api, fetchClient } from '@/api/client';
import { AuthRequestError } from '@/features/auth';
import { agentHeadingName } from '../agent-authorization';
import {
  AGENT_CLIENT_ENDPOINT,
  AGENT_WORKSPACE_ENDPOINT,
  UNNAMED_AGENT,
} from '../agents.constants';

/** The agent asking for access: its name, and whether Crossmart could verify it. */
export function useAgentClient(clientId: string | null) {
  return api.useQuery(
    'get',
    AGENT_CLIENT_ENDPOINT,
    { params: { query: { clientId: clientId ?? '' } } },
    { enabled: clientId !== null },
  );
}

/** The agent's name for headings, once known; quoted when it is unverified. */
export function useAgentHeadingName(clientId: string | null): string {
  const { data: client } = useAgentClient(clientId);
  return client ? agentHeadingName(client) : UNNAMED_AGENT;
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
