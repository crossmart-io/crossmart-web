import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import {
  canManageWorkspace,
  InviteMemberDialog,
  MembersTable,
  PendingInvitations,
  useCurrentWorkspace,
  useMe,
} from '@/features/workspaces';

export function MembersPage() {
  const { workspace } = useCurrentWorkspace();
  const { data: me } = useMe();
  const canManage = workspace !== undefined && canManageWorkspace(workspace.role);

  return (
    <Page
      name="Members"
      parents={PAGE_PARENTS.settings}
      description="People who work in this workspace and what they can do."
      actions={canManage && <InviteMemberDialog workspace={workspace} />}
    >
      <WorkspaceGate>
        {(current) => (
          <div className="flex flex-col gap-8">
            <MembersTable workspace={current} currentUserId={me?.id ?? ''} />
            {canManageWorkspace(current.role) && <PendingInvitations workspaceId={current.id} />}
          </div>
        )}
      </WorkspaceGate>
    </Page>
  );
}
