import { WorkspacePermission } from '@/api/schema';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import {
  DeleteWorkspaceCard,
  hasPermission,
  RenameWorkspaceCard,
  TimeZoneCard,
} from '@/features/workspaces';

export function WorkspaceSettingsPage() {
  return (
    <Page
      name="Workspace"
      parents={PAGE_PARENTS.settings}
      description="This workspace's name and time zone, and deleting it with all its data."
    >
      <WorkspaceGate>
        {(workspace) => (
          <div className="flex max-w-2xl flex-col gap-6">
            {hasPermission(workspace, WorkspacePermission.workspace_manage) && (
              // Keyed so the form starts from the new name after a switch or a rename.
              <RenameWorkspaceCard
                key={`${workspace.id}:${workspace.name}`}
                workspace={workspace}
              />
            )}
            {hasPermission(workspace, WorkspacePermission.workspace_manage) && (
              <TimeZoneCard key={`${workspace.id}:${workspace.timeZone}`} workspace={workspace} />
            )}
            {hasPermission(workspace, WorkspacePermission.workspace_delete) && (
              <DeleteWorkspaceCard
                workspaceId={workspace.id}
                workspaceName={workspace.displayName}
              />
            )}
          </div>
        )}
      </WorkspaceGate>
    </Page>
  );
}
