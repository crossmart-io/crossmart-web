import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMembers } from '../hooks/useMembers';
import { WORKSPACE_ROLE_DESCRIPTIONS, WORKSPACE_ROLE_LABELS } from '../workspace-role';

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

export function MembersTable({ workspaceId }: { workspaceId: string }) {
  const { data: members = [] } = useMembers(workspaceId);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden sm:table-cell">Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.userId}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="flex flex-col">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-xs text-muted-foreground">{member.email}</span>
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" title={WORKSPACE_ROLE_DESCRIPTIONS[member.role]}>
                  {WORKSPACE_ROLE_LABELS[member.role]}
                </Badge>
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {DATE_FORMAT.format(new Date(member.joinedAt))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
