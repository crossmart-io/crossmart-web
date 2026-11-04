import { type WorkspacePermission, WorkspaceRole } from '@/api/schema';
import type { Workspace } from './hooks/useCurrentWorkspace';

export const WORKSPACE_ROLE_LABELS: Record<WorkspaceRole, string> = {
  [WorkspaceRole.OWNER]: 'Owner',
  [WorkspaceRole.ADMIN]: 'Admin',
  [WorkspaceRole.EDITOR]: 'Editor',
  [WorkspaceRole.APPROVER]: 'Approver',
  [WorkspaceRole.VIEWER]: 'Viewer',
};

export const WORKSPACE_ROLE_DESCRIPTIONS: Record<WorkspaceRole, string> = {
  [WorkspaceRole.OWNER]: 'Everything, including deleting the workspace',
  [WorkspaceRole.ADMIN]: 'Everything except deleting the workspace',
  [WorkspaceRole.EDITOR]: 'Edit the catalog',
  [WorkspaceRole.APPROVER]: 'Approve AI suggestions',
  [WorkspaceRole.VIEWER]: 'Read only',
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

/** Every role, most access first. */
const ALL_ROLES: readonly WorkspaceRole[] = [
  WorkspaceRole.OWNER,
  WorkspaceRole.ADMIN,
  WorkspaceRole.EDITOR,
  WorkspaceRole.APPROVER,
  WorkspaceRole.VIEWER,
];

/**
 * The roles a member with `role` may give or take away: an Owner any, an Admin any but Owner,
 * everyone else none. The API enforces the same rule.
 */
export function grantableRoles(role: WorkspaceRole): readonly WorkspaceRole[] {
  if (role === WorkspaceRole.OWNER) return ALL_ROLES;
  if (role === WorkspaceRole.ADMIN)
    return ALL_ROLES.filter((other) => other !== WorkspaceRole.OWNER);
  return [];
}

export function isWorkspaceRole(value: string): value is WorkspaceRole {
  return Object.values<string>(WorkspaceRole).includes(value);
}
