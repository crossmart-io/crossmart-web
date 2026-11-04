import { ShieldPlus } from 'lucide-react';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { CustomRole, Workspace } from '@/features/workspaces';
import { useDeleteRole } from '../hooks/useRoleMutations';
import { RoleEditorDialog } from './RoleEditorDialog';

interface CustomRolesTableProps {
  workspace: Workspace;
  roles: readonly CustomRole[];
  canManage: boolean;
}

export function CustomRolesTable({ workspace, roles, canManage }: CustomRolesTableProps) {
  if (roles.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShieldPlus />
          </EmptyMedia>
          <EmptyTitle>No roles of your own yet</EmptyTitle>
          <EmptyDescription>
            Create one when a built-in role gives too much or too little, such as someone who only
            counts stock.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Members</TableHead>
            <TableHead className="hidden text-right sm:table-cell">Permissions</TableHead>
            {canManage && <TableHead className="w-40" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>
                <span className="flex flex-col">
                  <span className="font-medium">{role.name}</span>
                  {role.description && (
                    <span className="text-xs text-muted-foreground">{role.description}</span>
                  )}
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums">{role.memberCount}</TableCell>
              <TableCell className="hidden text-right tabular-nums text-muted-foreground sm:table-cell">
                {role.permissions.length}
              </TableCell>
              {canManage && (
                <TableCell className="text-right">
                  <RoleActions workspace={workspace} role={role} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RoleActions({ workspace, role }: { workspace: Workspace; role: CustomRole }) {
  const remove = useDeleteRole(workspace.id);
  return (
    <div className="flex justify-end gap-1">
      <RoleEditorDialog
        workspace={workspace}
        role={role}
        trigger={
          <Button variant="ghost" size="sm" aria-label={`Edit ${role.name}`}>
            Edit
          </Button>
        }
      />
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="sm" aria-label={`Delete ${role.name}`}>
            Delete
          </Button>
        }
        title={`Delete ${role.name}?`}
        description="Only a role nobody has can be deleted: give its members, pending invitations and API keys another role first."
        confirmLabel="Delete role"
        onConfirm={() => remove.mutateAsync(role.id)}
      />
    </div>
  );
}
