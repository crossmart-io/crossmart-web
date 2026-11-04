import { type WorkspacePermission, WorkspaceRole } from '@/api/schema';
import type { Workspace } from './hooks/useCurrentWorkspace';

export const WORKSPACE_ROLE_LABELS: Record<WorkspaceRole, string> = {
  [WorkspaceRole.OWNER]: 'Owner',
  [WorkspaceRole.ADMIN]: 'Admin',
  [WorkspaceRole.EDITOR]: 'Editor',
  [WorkspaceRole.APPROVER]: 'Approver',
  [WorkspaceRole.VIEWER]: 'Viewer',
  [WorkspaceRole.CUSTOM]: 'Custom',
};

export const WORKSPACE_ROLE_DESCRIPTIONS: Record<WorkspaceRole, string> = {
  [WorkspaceRole.OWNER]: 'Everything, including deleting the workspace',
  [WorkspaceRole.ADMIN]: 'Everything except deleting the workspace',
  [WorkspaceRole.EDITOR]: 'Edit the catalog',
  [WorkspaceRole.APPROVER]: 'Approve AI suggestions',
  [WorkspaceRole.VIEWER]: 'Read only',
  [WorkspaceRole.CUSTOM]: 'A role this workspace defined',
};

/**
 * Whether the user may do something here. The API sends the permissions of the user's role, so
 * the app never reasons about role names and keeps working when roles change.
 */
export function hasPermission(
  workspace: Pick<Workspace, 'permissions'>,
  permission: WorkspacePermission,
): boolean {
  return workspace.permissions.includes(permission);
}

export function isWorkspaceRole(value: string): value is WorkspaceRole {
  return Object.values<string>(WorkspaceRole).includes(value);
}
