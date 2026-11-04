import { Plus } from 'lucide-react';
import { WorkspacePermission } from '@/api/schema';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { Button } from '@/components/ui/button';
import { PAGE_PARENTS } from '@/config/navigation';
import { RoleEditorDialog, RolesOverview } from '@/features/roles';
import { hasPermission, useCurrentWorkspace } from '@/features/workspaces';

export function RolesPage() {
  const { workspace } = useCurrentWorkspace();
  const canManage =
    workspace !== undefined && hasPermission(workspace, WorkspacePermission.members_manage);

  return (
    <Page
      name="Roles"
      parents={PAGE_PARENTS.settings}
      description="What each role lets people and API keys do. Create your own when the built-in ones do not fit."
      actions={
        canManage && (
          <RoleEditorDialog
            workspace={workspace}
            trigger={
              <Button>
                <Plus data-icon="inline-start" />
                Create role
              </Button>
            }
          />
        )
      }
    >
      <WorkspaceGate>{(current) => <RolesOverview workspace={current} />}</WorkspaceGate>
    </Page>
  );
}
