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
    role,
  };
}

const OWNER_MEMBER: WorkspaceMember = {
  userId: 'u2',
  name: 'Bo',
  email: 'bo@example.com',
  role: WorkspaceRole.OWNER,
  joinedAt: '2026-11-01T00:00:00Z',
};

function renderActions(role: WorkspaceRole, isYou = false) {
  render(
    <MemoryRouter>
      <MemberActions workspace={workspaceAs(role)} member={OWNER_MEMBER} isYou={isYou} />
    </MemoryRouter>,
  );
}

describe('MemberActions', () => {
  it('lets an owner remove another owner', () => {
    renderActions(WorkspaceRole.OWNER);
    expect(screen.getByRole('button', { name: 'Remove Bo' })).toBeInTheDocument();
  });

  it('gives an admin no action on an owner', () => {
    renderActions(WorkspaceRole.ADMIN);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('offers to leave on your own row', () => {
    renderActions(WorkspaceRole.VIEWER, true);
    expect(screen.getByRole('button', { name: 'Leave' })).toBeInTheDocument();
  });
});
