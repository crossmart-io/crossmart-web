import type { ReactNode } from 'react';
import type { WorkspacePermission } from '@/api/schema';
import { hasPermission, type Workspace } from '@/features/workspaces';
import { WorkspaceGate } from './WorkspaceGate';

interface PermissionGateProps {
  permission: WorkspacePermission;
  /** Why the page is empty for a role without the permission. */
  denied: string;
  children: (workspace: Workspace) => ReactNode;
}

/** Renders once the workspace is known, and only for a role that holds `permission`. */
export function PermissionGate({ permission, denied, children }: PermissionGateProps) {
  return (
    <WorkspaceGate>
      {(workspace) =>
        hasPermission(workspace, permission) ? (
          children(workspace)
        ) : (
          <p className="text-sm text-muted-foreground">{denied}</p>
        )
      }
    </WorkspaceGate>
  );
}
