import { useEffect } from 'react';
import { useLocation } from 'react-router';
import {
  AgentAuthorizationShell,
  AgentConsentForm,
  AgentIdentity,
  agentClientId,
  useAgentHeadingName,
} from '@/features/agents';
import { AuthCard, refreshSession, useSession } from '@/features/auth';
import { useMe } from '@/features/workspaces';

/**
 * The workspace picked in step one, from the session the API saved it on. The session is read
 * again on arrival: the copy loaded at sign-in predates the pick.
 */
function usePickedWorkspaceName(): string | undefined {
  useEffect(refreshSession, []);
  const { data: session } = useSession();
  const { data: me } = useMe();
  const workspaceId = session?.session.oauthWorkspaceId;
  return me?.workspaces.find((workspace) => workspace.id === workspaceId)?.displayName;
}

/** An agent's sign-in, step two: what it may do, and the answer. */
export function AgentConsentPage() {
  const clientId = agentClientId(useLocation().search);
  const agentName = useAgentHeadingName(clientId);
  const workspaceName = usePickedWorkspaceName();
  return (
    <AgentAuthorizationShell>
      <AuthCard
        title={`Allow ${agentName}?`}
        description={
          workspaceName
            ? `It will work in ${workspaceName}, as you.`
            : 'It will work in your workspace, as you.'
        }
        footer={<AgentIdentity clientId={clientId} />}
      >
        <AgentConsentForm />
      </AuthCard>
    </AgentAuthorizationShell>
  );
}
