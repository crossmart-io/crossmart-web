import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { WorkspaceRole } from '@/api/schema';
import type { Workspace } from '../hooks/useCurrentWorkspace';
import type { WorkspaceMember } from '../hooks/useMembers';
import { MemberActions } from './MemberActions';

vi.mock('../hooks/useMembers', () => ({
  useLeaveWorkspace: vi.fn<() => unknown>(() => ({ mutateAsync: vi.fn<() => Promise<void>>() })),
  useRemoveMember: vi.fn<() => unknown>(() => ({ mutateAsync: vi.fn<() => Promise<void>>() })),
}));

function workspaceAs(role: WorkspaceRole): Workspace {
  return {
    id: 'ws',
    organizationId: 'org',
    name: 'Default',
    displayName: 'Ana',
    slug: 'default',
    currency: 'USD',
    timeZone: null,
    role,
    customRole: null,
    permissions: [],
  };
}

const OWNER_MEMBER: WorkspaceMember = {
  userId: 'u2',
  name: 'Bo',
  email: 'bo@example.com',
  role: WorkspaceRole.OWNER,
  customRole: null,
  joinedAt: '2026-11-01T00:00:00Z',
};

function renderActions(
  role: WorkspaceRole,
  { isYou = false, manageable = false, canLeave = true } = {},
) {
  render(
    <MemoryRouter>
      <MemberActions
        workspace={workspaceAs(role)}
        member={OWNER_MEMBER}
        isYou={isYou}
        manageable={manageable}
        canLeave={canLeave}
      />
    </MemoryRouter>,
  );
}

describe('MemberActions', () => {
  it('offers to remove a member the user may manage', () => {
    renderActions(WorkspaceRole.OWNER, { manageable: true });
    expect(screen.getByRole('button', { name: 'Remove Bo' })).toBeInTheDocument();
  });

  it('gives no action on a member the user may not manage', () => {
    renderActions(WorkspaceRole.ADMIN);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('offers to leave on your own row', () => {
    renderActions(WorkspaceRole.VIEWER, { isYou: true });
    expect(screen.getByRole('button', { name: 'Leave' })).toBeInTheDocument();
  });

  it('gives the only owner no way to leave', () => {
    renderActions(WorkspaceRole.OWNER, { isYou: true, canLeave: false });
    expect(screen.queryByRole('button', { name: 'Leave' })).not.toBeInTheDocument();
  });
});
