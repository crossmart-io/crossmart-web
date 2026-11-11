import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { WorkspacePermission } from '@/api/schema';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { SETTINGS_COPY, SettingsSection } from '@/features/settings';
import {
  hasPermission,
  InviteMemberDialog,
  MembersTable,
  PendingInvitations,
  useMe,
  type Workspace,
} from '@/features/workspaces';

function TeamActions({ workspace }: { workspace: Workspace }) {
  return (
    <>
      <Button variant="outline" asChild>
        <Link to={ROUTES.roles}>
          <ShieldCheck data-icon="inline-start" />
          {SETTINGS_COPY.manageRoles}
        </Link>
      </Button>
      {hasPermission(workspace, WorkspacePermission.members_manage) && (
        <InviteMemberDialog workspace={workspace} />
      )}
    </>
  );
}

/** Settings › Team: the people in the workspace with their roles, and invitations. */
export function TeamPage() {
  const { data: me } = useMe();
  return (
    <WorkspaceGate>
      {(workspace) => (
        <SettingsSection
          title={SETTINGS_COPY.members}
          actions={<TeamActions workspace={workspace} />}
        >
          <MembersTable workspace={workspace} currentUserId={me?.id ?? ''} />
          {hasPermission(workspace, WorkspacePermission.members_manage) && (
            <PendingInvitations workspaceId={workspace.id} />
          )}
        </SettingsSection>
      )}
    </WorkspaceGate>
  );
}
