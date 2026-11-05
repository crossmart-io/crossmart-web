import { WorkspacePermission } from '@/api/schema';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/format';
import type { Workspace } from '../hooks/useCurrentWorkspace';
import { useMembers, type WorkspaceMember } from '../hooks/useMembers';
import { useRoleCatalog } from '../hooks/useRoleCatalog';
import { covers, grantableOptions, type RoleOption, roleOptions, roleValue } from '../role-options';
import { hasPermission } from '../workspace-role';
import { MemberActions } from './MemberActions';
import { MemberRole } from './MemberRole';

interface MembersTableProps {
  workspace: Workspace;
  /** The signed-in user, who may leave but not edit their own row. */
  currentUserId: string;
}

/** What the user may do to one member: change or remove them only if they cover that role. */
interface MemberAccess {
  manageable: boolean;
  /** The roles the user may give. */
  grantable: readonly RoleOption[];
}

export function MembersTable({ workspace, currentUserId }: MembersTableProps) {
  const members = useMembers(workspace.id);
  const catalog = useRoleCatalog(workspace.id);

  const error = members.error ?? catalog.error;
  if (error) {
    const refetch = () => Promise.all([members.refetch(), catalog.refetch()]);
    return <ErrorState title="Members could not be loaded" error={error} onRetry={refetch} />;
  }
  if (!members.data || !catalog.data) return <Skeleton className="h-32 w-full" />;

  const options = roleOptions(catalog.data);
  const grantable = grantableOptions(options, workspace.permissions);
  const canManage = hasPermission(workspace, WorkspacePermission.members_manage);
  const accessTo = (member: WorkspaceMember): MemberAccess => {
    const held = options.find((option) => option.value === roleValue(member));
    return { manageable: canManage && !!held && covers(workspace.permissions, held), grantable };
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden sm:table-cell">Joined</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.data.map((member) => (
            <MemberRow
              key={member.userId}
              workspace={workspace}
              member={member}
              isYou={member.userId === currentUserId}
              access={accessTo(member)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface MemberRowProps {
  workspace: Workspace;
  member: WorkspaceMember;
  isYou: boolean;
  access: MemberAccess;
}

function MemberRow({ workspace, member, isYou, access }: MemberRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-medium">
              {member.name}
              {isYou && <span className="font-normal text-muted-foreground"> (you)</span>}
            </span>
            <span className="truncate text-xs text-muted-foreground">{member.email}</span>
          </span>
        </div>
      </TableCell>
      <TableCell>
        <MemberRole
          workspaceId={workspace.id}
          member={member}
          options={access.grantable}
          editable={access.manageable && !isYou}
        />
      </TableCell>
      <TableCell className="hidden text-muted-foreground sm:table-cell">
        {formatDate(member.joinedAt)}
      </TableCell>
      <TableCell className="text-right">
        <MemberActions
          workspace={workspace}
          member={member}
          isYou={isYou}
          manageable={access.manageable}
        />
      </TableCell>
    </TableRow>
  );
}
