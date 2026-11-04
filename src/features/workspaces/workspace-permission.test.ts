import { WorkspacePermission } from '@/api/schema';
import { hasPermission } from './workspace-role';

describe('hasPermission', () => {
  it('reads the permissions the API sent, not the role', () => {
    const workspace = { permissions: [WorkspacePermission.products_view] };
    expect(hasPermission(workspace, WorkspacePermission.products_view)).toBe(true);
    expect(hasPermission(workspace, WorkspacePermission.products_edit)).toBe(false);
  });
});
