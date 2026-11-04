import { WorkspaceRole } from '@/api/schema';

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

/** Roles that may manage the workspace: connect channels, change settings. */
const MANAGING_ROLES: ReadonlySet<WorkspaceRole> = new Set([
  WorkspaceRole.OWNER,
  WorkspaceRole.ADMIN,
]);

export function canManageWorkspace(role: WorkspaceRole): boolean {
  return MANAGING_ROLES.has(role);
}

/** Roles that may change the catalog: edit products, import them, and set what each channel shows. */
const EDITING_ROLES: ReadonlySet<WorkspaceRole> = new Set([
  WorkspaceRole.OWNER,
  WorkspaceRole.ADMIN,
  WorkspaceRole.EDITOR,
]);

export function canEditCatalog(role: WorkspaceRole): boolean {
  return EDITING_ROLES.has(role);
}
