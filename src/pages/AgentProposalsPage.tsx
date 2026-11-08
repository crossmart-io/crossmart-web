import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { AGENT_PROPOSALS_COPY, AgentProposalsInbox } from '@/features/agent-proposals';

/** Changes outside AI agents proposed, waiting for the seller (ADR 0028). */
export function AgentProposalsPage() {
  return (
    <Page name={AGENT_PROPOSALS_COPY.pageName} description={AGENT_PROPOSALS_COPY.pageDescription}>
      <WorkspaceGate>{(workspace) => <AgentProposalsInbox workspace={workspace} />}</WorkspaceGate>
    </Page>
  );
}
