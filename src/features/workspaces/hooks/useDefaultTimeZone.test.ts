import { renderHook } from '@testing-library/react';
import { WorkspacePermission, WorkspaceRole } from '@/api/schema';
import type { Workspace } from './useCurrentWorkspace';
import { useDefaultTimeZone } from './useDefaultTimeZone';
import { useUpdateWorkspace } from './useWorkspaceMutations';

vi.mock('./useWorkspaceMutations', () => ({
  useUpdateWorkspace: vi.fn<typeof useUpdateWorkspace>(),
}));

function workspace(fields: Partial<Workspace>): Workspace {
  return {
    id: 'ws',
    organizationId: 'org',
    name: 'Default',
    displayName: 'Ana',
    slug: 'default',
    currency: 'USD',
    timeZone: null,
    sandbox: null,
    role: WorkspaceRole.OWNER,
    customRole: null,
    permissions: [WorkspacePermission.workspace_manage],
    ...fields,
  };
}

function setup(current: Workspace) {
  const mutate = vi.fn<(changes: { timeZone?: string }) => void>();
  vi.mocked(useUpdateWorkspace).mockReturnValue({
    mutate,
  } as unknown as ReturnType<typeof useUpdateWorkspace>);
  const { rerender } = renderHook(() => useDefaultTimeZone(current));
  rerender();
  return { mutate };
}

describe('useDefaultTimeZone', () => {
  it('sets the browser’s zone once on a workspace without one', () => {
    const { mutate } = setup(workspace({}));
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith({
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  });

  it('leaves a set zone, and workspaces the user may not change, alone', () => {
    expect(setup(workspace({ timeZone: 'Asia/Jerusalem' })).mutate).not.toHaveBeenCalled();
    expect(setup(workspace({ permissions: [] })).mutate).not.toHaveBeenCalled();
  });
});
