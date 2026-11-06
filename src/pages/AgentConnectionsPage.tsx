import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { AgentConnectionsTable, ConnectAgentCard } from '@/features/agents';

export function AgentConnectionsPage() {
  return (
    <Page
      name="Connected agents"
      parents={PAGE_PARENTS.settings}
      description="AI assistants you or your team connected to this workspace. Each acts for the person who connected it."
    >
      <div className="flex flex-col gap-6">
        <ConnectAgentCard />
        <WorkspaceGate>
          {(workspace) => <AgentConnectionsTable workspaceId={workspace.id} />}
        </WorkspaceGate>
      </div>
    </Page>
  );
}
