import { WorkspacePermission, WorkspaceRole } from '@/api/schema';
import {
  grantableOptions,
  roleLabel,
  roleOptions,
  roleValue,
  type RoleCatalog,
} from './role-options';

const CATALOG: RoleCatalog = {
  builtIn: [
    { role: WorkspaceRole.ADMIN, permissions: [WorkspacePermission.members_manage] },
    { role: WorkspaceRole.VIEWER, permissions: [WorkspacePermission.orders_view] },
  ],
  custom: [
    {
      id: 'role-1',
      name: 'Stock clerk',
      description: null,
      permissions: [WorkspacePermission.inventory_edit],
      memberCount: 0,
      createdAt: '2026-11-04T00:00:00Z',
      updatedAt: '2026-11-04T00:00:00Z',
    },
  ],
};

describe('role options', () => {
  it('lists built-in roles, then custom ones as CUSTOM with their id', () => {
    const options = roleOptions(CATALOG);
    expect(options.map((option) => option.label)).toEqual(['Admin', 'Viewer', 'Stock clerk']);
    expect(options[2]?.assignment).toEqual({ role: WorkspaceRole.CUSTOM, customRoleId: 'role-1' });
    expect(options[2]?.description).toBe('1 permission');
  });

  it('offers only roles the user’s permissions cover', () => {
    const grantable = grantableOptions(roleOptions(CATALOG), [
      WorkspacePermission.orders_view,
      WorkspacePermission.inventory_edit,
    ]);
    expect(grantable.map((option) => option.label)).toEqual(['Viewer', 'Stock clerk']);
  });

  it('names and identifies a held role', () => {
    const held = { role: WorkspaceRole.CUSTOM, customRole: { id: 'role-1', name: 'Stock clerk' } };
    expect(roleLabel(held)).toBe('Stock clerk');
    expect(roleValue(held)).toBe('custom:role-1');
    expect(roleLabel({ role: WorkspaceRole.EDITOR, customRole: null })).toBe('Editor');
  });
});
