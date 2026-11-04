import { WorkspaceRole } from '@/api/schema';
import { grantableRoles } from './workspace-role';

describe('grantableRoles', () => {
  it('lets owners grant any role, admins any but owner, and others none', () => {
    expect(grantableRoles(WorkspaceRole.OWNER)).toContain(WorkspaceRole.OWNER);
    expect(grantableRoles(WorkspaceRole.ADMIN)).toEqual([
      WorkspaceRole.ADMIN,
      WorkspaceRole.EDITOR,
      WorkspaceRole.APPROVER,
      WorkspaceRole.VIEWER,
    ]);
    expect(grantableRoles(WorkspaceRole.EDITOR)).toEqual([]);
  });
});
