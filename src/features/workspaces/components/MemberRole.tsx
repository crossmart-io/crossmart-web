import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useChangeMemberRole, type WorkspaceMember } from '../hooks/useMembers';
import { type RoleOption, roleLabel, roleValue } from '../role-options';
import { WORKSPACE_ROLE_DESCRIPTIONS } from '../workspace-role';
import { RoleSelect } from './RoleSelect';

interface MemberRoleProps {
  workspaceId: string;
  member: WorkspaceMember;
  /** The roles the user may give. */
  options: readonly RoleOption[];
  editable: boolean;
}

/** A role picker for members the user may manage; a badge explaining the role otherwise. */
export function MemberRole({ workspaceId, member, options, editable }: MemberRoleProps) {
  const changeRole = useChangeMemberRole(workspaceId);

  if (!editable) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Focusable, so keyboard users can read what the role allows. */}
          <Badge variant="secondary" tabIndex={0}>
            {roleLabel(member)}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{WORKSPACE_ROLE_DESCRIPTIONS[member.role]}</TooltipContent>
      </Tooltip>
    );
  }
  return (
    <RoleSelect
      value={roleValue(member)}
      options={options}
      ariaLabel={`Role of ${member.name}`}
      disabled={changeRole.isPending}
      onChange={(option) => changeRole.mutate({ userId: member.userId, ...option.assignment })}
      className="w-36"
    />
  );
}
