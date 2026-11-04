import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { WorkspaceRole } from '@/api/schema';
import { DeleteAccountCard, DeleteWorkspaceCard, useMe } from '@/features/workspaces';

/** Closing the workspace (owners) or the account: everything is deleted, as the privacy policy says. */
export function AccountPage() {
  const { data: me } = useMe();
  return (
    <Page
      name="Account"
      parents={PAGE_PARENTS.settings}
      description="Delete your workspace or your account, with all their data."
    >
      <div className="flex max-w-2xl flex-col gap-6">
        <WorkspaceGate>
          {(workspace) =>
            workspace.role === WorkspaceRole.OWNER ? (
              <DeleteWorkspaceCard workspaceId={workspace.id} workspaceName={workspace.name} />
            ) : null
          }
        </WorkspaceGate>
        {me && <DeleteAccountCard email={me.email} />}
      </div>
    </Page>
  );
}
