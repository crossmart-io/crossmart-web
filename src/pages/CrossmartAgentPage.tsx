import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { AgentConsole } from '@/features/agent-console';
import { AGENT_WORKER_COPY } from '@/features/agent-worker';

/**
 * Crossmart Agent: chat with the agent, watch it work on the live map of the catalog and its
 * stores, and follow everything that happens in the workspace as it happens.
 */
export function CrossmartAgentPage() {
  return (
    <Page name={AGENT_WORKER_COPY.name} headerHidden>
      <WorkspaceGate>{(workspace) => <AgentConsole workspaceId={workspace.id} />}</WorkspaceGate>
    </Page>
  );
}
