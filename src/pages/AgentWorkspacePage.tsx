import { useLocation } from 'react-router';
import { AuthCard } from '@/features/auth';
import {
  AgentAuthorizationShell,
  AgentIdentity,
  AgentWorkspacePicker,
  agentClientId,
  useAgentHeadingName,
} from '@/features/agents';

/** An agent's sign-in, step one: the workspace it will work in. */
export function AgentWorkspacePage() {
  const clientId = agentClientId(useLocation().search);
  const agentName = useAgentHeadingName(clientId);
  return (
    <AgentAuthorizationShell>
      <AuthCard
        title={`Connect ${agentName}`}
        description="Choose the workspace it will work in. It can never act in any other."
        footer={<AgentIdentity clientId={clientId} />}
      >
        <AgentWorkspacePicker />
      </AuthCard>
    </AgentAuthorizationShell>
  );
}
