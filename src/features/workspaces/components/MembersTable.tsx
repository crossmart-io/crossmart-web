import { ErrorState } from '@/components/feedback/ErrorState';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/format';
import { useMembers } from '../hooks/useMembers';
import { WORKSPACE_ROLE_DESCRIPTIONS, WORKSPACE_ROLE_LABELS } from '../workspace-role';

export function MembersTable({ workspaceId }: { workspaceId: string }) {
  const { data: members, isPending, error, refetch } = useMembers(workspaceId);

  if (error) {
    return <ErrorState title="Members could not be loaded" error={error} onRetry={refetch} />;
  }
  if (isPending) return <Skeleton className="h-32 w-full" />;

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
                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* Focusable, so keyboard users can read what the role allows. */}
                    <Badge variant="secondary" tabIndex={0}>
                      {WORKSPACE_ROLE_LABELS[member.role]}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{WORKSPACE_ROLE_DESCRIPTIONS[member.role]}</TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {formatDate(member.joinedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
