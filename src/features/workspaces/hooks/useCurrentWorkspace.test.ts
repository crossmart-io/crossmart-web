import { act, renderHook } from '@testing-library/react';
import { WorkspaceRole } from '@/api/schema';
import { selectWorkspace } from '../selected-workspace';
import { useCurrentWorkspace, type Workspace } from './useCurrentWorkspace';
import { useMe } from './useMe';

vi.mock('./useMe', () => ({ useMe: vi.fn<typeof useMe>() }));

function workspace(id: string): Workspace {
  return {
    id,
    organizationId: 'org',
    name: 'Default',
    displayName: id,
    slug: 'default',
    currency: 'USD',
    role: WorkspaceRole.OWNER,
    permissions: [],
  };
}

describe('useCurrentWorkspace', () => {
  beforeEach(() => {
    vi.mocked(useMe).mockReturnValue({
      data: { id: 'u', name: 'U', email: 'u@x.y', workspaces: [workspace('a'), workspace('b')] },
      isPending: false,
      isError: false,
      error: null,
      refetch: vi.fn<() => void>(),
    } as unknown as ReturnType<typeof useMe>);
  });

  it('opens the picked workspace, and the first when the pick is gone', () => {
    const { result } = renderHook(() => useCurrentWorkspace());
    act(() => selectWorkspace('b'));
    expect(result.current.workspace?.id).toBe('b');

    act(() => selectWorkspace('left-long-ago'));
    expect(result.current.workspace?.id).toBe('a');
  });
});
