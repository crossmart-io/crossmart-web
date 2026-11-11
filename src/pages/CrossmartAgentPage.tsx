import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { AgentConsole } from '@/features/agent-console';
import { AGENT_WORKER_COPY } from '@/features/agent-worker';
import { AgentTabs } from '@/features/review';
import { useCurrentWorkspace } from '@/features/workspaces';

/**
 * Crossmart Agent: chat with the agent, watch it work on the live map of the catalog and its
 * stores, and follow everything that happens in the workspace as it happens.
 */
export function CrossmartAgentPage() {
  const { workspace } = useCurrentWorkspace();
  return (
    <Page name={AGENT_WORKER_COPY.name} headerHidden>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <AgentTabs workspace={workspace} />
        <div className="min-h-0 flex-1">
          <WorkspaceGate>{(current) => <AgentConsole workspaceId={current.id} />}</WorkspaceGate>
        </div>
      </div>
    </Page>
  );
}
