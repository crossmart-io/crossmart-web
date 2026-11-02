import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { PageHeader } from '@/components/layout/PageHeader';
import { MembersTable } from '@/features/workspaces';

export function MembersPage() {
  return (
    <>
      <PageHeader
        title="Members"
        description="People who work in this workspace and what they can do. Invitations are coming soon."
      />
      <WorkspaceGate>{(workspace) => <MembersTable workspaceId={workspace.id} />}</WorkspaceGate>
    </>
  );
}
