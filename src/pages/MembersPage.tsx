import { WorkspacePermission } from '@/api/schema';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import {
  InviteMemberDialog,
  MembersTable,
  PendingInvitations,
  useCurrentWorkspace,
  hasPermission,
  useMe,
} from '@/features/workspaces';

export function MembersPage() {
  const { workspace } = useCurrentWorkspace();
  const { data: me } = useMe();
  const canManage =
    workspace !== undefined && hasPermission(workspace, WorkspacePermission.members_manage);

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
            {hasPermission(current, WorkspacePermission.members_manage) && (
              <PendingInvitations workspaceId={current.id} />
            )}
          </div>
        )}
      </WorkspaceGate>
    </Page>
  );
}
