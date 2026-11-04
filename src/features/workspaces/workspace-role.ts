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
