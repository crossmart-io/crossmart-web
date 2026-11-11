import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { AgentTabs, REVIEW_COPY, ReviewInbox } from '@/features/review';
import { useCurrentWorkspace } from '@/features/workspaces';

/** Agent › Review: AI suggestions and outside agents' proposals waiting for the seller. */
export function AgentReviewPage() {
  const { workspace } = useCurrentWorkspace();
  return (
    <Page name={REVIEW_COPY.pageName} title={REVIEW_COPY.agentTitle}>
      <AgentTabs workspace={workspace} />
      <WorkspaceGate>{(current) => <ReviewInbox workspace={current} />}</WorkspaceGate>
    </Page>
  );
}
