import { useNavigate } from 'react-router';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import type { Workspace } from '../hooks/useCurrentWorkspace';
import { useLeaveWorkspace, useRemoveMember, type WorkspaceMember } from '../hooks/useMembers';

interface MemberActionsProps {
  workspace: Workspace;
  member: WorkspaceMember;
  isYou: boolean;
  /** Whether the user may remove this member: their role covers the member's. */
  manageable: boolean;
}

/** Leave for the user's own row, remove for members they may manage, nothing otherwise. */
export function MemberActions({ workspace, member, isYou, manageable }: MemberActionsProps) {
  if (isYou) return <LeaveButton workspace={workspace} />;
  if (!manageable) return null;
  return <RemoveButton workspaceId={workspace.id} member={member} />;
}

function RemoveButton({ workspaceId, member }: { workspaceId: string; member: WorkspaceMember }) {
  const remove = useRemoveMember(workspaceId);
  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="sm" aria-label={`Remove ${member.name}`}>
          Remove
        </Button>
      }
      title={`Remove ${member.name}?`}
      description="They lose access right away, and the API keys they created here stop working."
      confirmLabel="Remove member"
      onConfirm={() => remove.mutateAsync(member.userId)}
    />
  );
}

function LeaveButton({ workspace }: { workspace: Workspace }) {
  const leave = useLeaveWorkspace(workspace.id);
  const navigate = useNavigate();
  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="sm">
          Leave
        </Button>
      }
      title={`Leave ${workspace.displayName}?`}
      description="You lose access right away, and your API keys here stop working. Someone has to invite you again to come back."
      confirmLabel="Leave workspace"
      onConfirm={async () => {
        await leave.mutateAsync();
        await navigate(ROUTES.home);
      }}
    />
  );
}
