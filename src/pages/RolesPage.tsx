import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { WorkspacePermission } from '@/api/schema';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { RoleEditorDialog, RolesOverview } from '@/features/roles';
import { SETTINGS_COPY, SettingsSection } from '@/features/settings';
import { hasPermission, type Workspace } from '@/features/workspaces';

function CreateRoleButton({ workspace }: { workspace: Workspace }) {
  if (!hasPermission(workspace, WorkspacePermission.members_manage)) return null;
  return (
    <RoleEditorDialog
      workspace={workspace}
      trigger={
        <Button>
          <Plus data-icon="inline-start" />
          Create role
        </Button>
      }
    />
  );
}

/** Settings › Team › Roles: what each role lets people and API keys do. */
export function RolesPage() {
  return (
    <WorkspaceGate>
      {(workspace) => (
        <div className="flex flex-col gap-3">
          <Link
            to={ROUTES.team}
            className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {SETTINGS_COPY.backToMembers}
          </Link>
          <SettingsSection
            title={SETTINGS_COPY.roles}
            actions={<CreateRoleButton workspace={workspace} />}
          >
            <RolesOverview workspace={workspace} />
          </SettingsSection>
        </div>
      )}
    </WorkspaceGate>
  );
}
