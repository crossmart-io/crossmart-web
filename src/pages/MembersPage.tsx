import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { MembersTable } from '@/features/workspaces';

export function MembersPage() {
  return (
    <Page
      name="Members"
      parents={PAGE_PARENTS.settings}
      description="People who work in this workspace and what they can do. Invitations are coming soon."
    >
      <WorkspaceGate>{(workspace) => <MembersTable workspaceId={workspace.id} />}</WorkspaceGate>
    </Page>
  );
}
