import { WorkspacePermission } from '@/api/schema';
import { PERMISSION_GROUPS } from './permission-groups';

describe('PERMISSION_GROUPS', () => {
  it('names every permission once, except the owner-only workspace deletion', () => {
    const listed = PERMISSION_GROUPS.flatMap((group) =>
      group.permissions.map((choice) => choice.permission),
    );
    const expected = Object.values(WorkspacePermission).filter(
      (permission) => permission !== WorkspacePermission.workspace_delete,
    );
    expect([...listed].sort()).toEqual([...expected].sort());
  });
});
