import { WorkspacePermission } from '@/api/schema';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { GeneralSettingsForm } from '@/features/settings';
import { DeleteWorkspaceCard, hasPermission } from '@/features/workspaces';

/** Settings › General: the workspace's own settings, and deleting it. */
export function GeneralSettingsPage() {
  return (
    <WorkspaceGate>
      {(workspace) => (
        <div className="flex max-w-2xl flex-col gap-6">
          {hasPermission(workspace, WorkspacePermission.workspace_manage) && (
            // Keyed so the form starts from the saved values after a switch or a save.
            <GeneralSettingsForm
              key={`${workspace.id}:${workspace.displayName}:${workspace.timeZone}:${workspace.outsideAgentChanges}`}
              workspace={workspace}
            />
          )}
          {hasPermission(workspace, WorkspacePermission.workspace_delete) && (
            <DeleteWorkspaceCard workspaceId={workspace.id} workspaceName={workspace.displayName} />
          )}
        </div>
      )}
    </WorkspaceGate>
  );
}
