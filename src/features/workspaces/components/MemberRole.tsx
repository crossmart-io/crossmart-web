import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Workspace } from '../hooks/useCurrentWorkspace';
import { useChangeMemberRole, type WorkspaceMember } from '../hooks/useMembers';
import {
  grantableRoles,
  WORKSPACE_ROLE_DESCRIPTIONS,
  WORKSPACE_ROLE_LABELS,
} from '../workspace-role';
import { RoleSelect } from './RoleSelect';

interface MemberRoleProps {
  workspace: Workspace;
  member: WorkspaceMember;
  isYou: boolean;
}

/** A role picker for members the user may manage; a badge explaining the role otherwise. */
export function MemberRole({ workspace, member, isYou }: MemberRoleProps) {
  const changeRole = useChangeMemberRole(workspace.id);
  const roles = grantableRoles(workspace.role);

  if (isYou || !roles.includes(member.role)) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Focusable, so keyboard users can read what the role allows. */}
          <Badge variant="secondary" tabIndex={0}>
            {WORKSPACE_ROLE_LABELS[member.role]}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{WORKSPACE_ROLE_DESCRIPTIONS[member.role]}</TooltipContent>
      </Tooltip>
    );
  }
  return (
    <RoleSelect
      value={member.role}
      roles={roles}
      ariaLabel={`Role of ${member.name}`}
      disabled={changeRole.isPending}
      onChange={(role) => changeRole.mutate({ userId: member.userId, role })}
      className="w-32"
    />
  );
}
