import { WorkspacePermission } from '@/api/schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  type RoleCatalog,
  WORKSPACE_ROLE_DESCRIPTIONS,
  WORKSPACE_ROLE_LABELS,
} from '@/features/workspaces';

const PERMISSION_TOTAL = Object.values(WorkspacePermission).length;

/** The roles every workspace has. They cannot change; they are templates to start from. */
export function BuiltInRolesTable({ roles }: { roles: RoleCatalog['builtIn'] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Can</TableHead>
            <TableHead className="hidden text-right sm:table-cell">Permissions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map(({ role, permissions }) => (
            <TableRow key={role}>
              <TableCell className="font-medium">{WORKSPACE_ROLE_LABELS[role]}</TableCell>
              <TableCell className="text-muted-foreground">
                {WORKSPACE_ROLE_DESCRIPTIONS[role]}
              </TableCell>
              <TableCell className="hidden text-right text-muted-foreground tabular-nums sm:table-cell">
                {permissions.length} of {PERMISSION_TOTAL}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
