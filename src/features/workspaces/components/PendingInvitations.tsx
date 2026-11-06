import { ErrorState } from '@/components/feedback/ErrorState';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ActionsTableHead } from '@/components/lists/ActionsTableHead';
import { formatDate } from '@/lib/format';
import { type Invitation, useInvitations, useRevokeInvitation } from '../hooks/useInvitations';
import { roleLabel } from '../role-options';

/** Invitations not yet accepted. Shown only to members who manage the workspace. */
export function PendingInvitations({ workspaceId }: { workspaceId: string }) {
  const { data: invitations, isPending, error, refetch } = useInvitations(workspaceId);

  if (error) {
    return <ErrorState title="Invitations could not be loaded" error={error} onRetry={refetch} />;
  }
  if (isPending) return <Skeleton className="h-20 w-full" />;
  if (invitations.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold">Pending invitations</h2>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Invited by</TableHead>
              <TableHead className="hidden sm:table-cell">Expires</TableHead>
              <ActionsTableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">{invitation.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{roleLabel(invitation)}</Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {invitation.invitedByName}
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {formatDate(invitation.expiresAt)}
                </TableCell>
                <TableCell className="text-right">
                  <RevokeInvitationButton workspaceId={workspaceId} invitation={invitation} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function RevokeInvitationButton({
  workspaceId,
  invitation,
}: {
  workspaceId: string;
  invitation: Invitation;
}) {
  const revoke = useRevokeInvitation(workspaceId);
  return (
    <ConfirmDialog
      trigger={
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Revoke the invitation of ${invitation.email}`}
        >
          Revoke
        </Button>
      }
      title={`Revoke the invitation of ${invitation.email}?`}
      description="The link in their email stops working. You can invite them again later."
      confirmLabel="Revoke invitation"
      onConfirm={() => revoke.mutateAsync(invitation.id)}
    />
  );
}
