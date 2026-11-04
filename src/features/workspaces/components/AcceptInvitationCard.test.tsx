import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { WorkspaceRole } from '@/api/schema';
import type * as Auth from '@/features/auth';
import { useSession, useSignOut } from '@/features/auth';
import { useAcceptInvitation, useInvitationPreview } from '../hooks/useInvitations';
import { AcceptInvitationCard } from './AcceptInvitationCard';

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof Auth>()),
  useSession: vi.fn<typeof useSession>(),
  useSignOut: vi.fn<typeof useSignOut>(),
}));
vi.mock('../hooks/useInvitations', () => ({
  useInvitationPreview: vi.fn<typeof useInvitationPreview>(),
  useAcceptInvitation: vi.fn<typeof useAcceptInvitation>(),
}));

const PREVIEW = {
  workspaceName: 'Ana Cohen',
  inviterName: 'Ana',
  email: 'bo@example.com',
  role: WorkspaceRole.EDITOR,
  expiresAt: '2026-11-11T00:00:00Z',
};

function setup(sessionEmail: string | null, previewError = false) {
  vi.mocked(useInvitationPreview).mockReturnValue({
    data: previewError ? undefined : PREVIEW,
    isPending: false,
    isError: previewError,
  } as unknown as ReturnType<typeof useInvitationPreview>);
  vi.mocked(useSession).mockReturnValue({
    data: sessionEmail ? { user: { email: sessionEmail } } : null,
    isPending: false,
  } as unknown as ReturnType<typeof useSession>);
  vi.mocked(useSignOut).mockReturnValue({
    mutate: vi.fn<() => void>(),
    isPending: false,
  } as unknown as ReturnType<typeof useSignOut>);
  const mutate = vi.fn<(token: string) => void>();
  vi.mocked(useAcceptInvitation).mockReturnValue({
    mutate,
    isPending: false,
    error: null,
  } as unknown as ReturnType<typeof useAcceptInvitation>);
  render(
    <MemoryRouter>
      <AcceptInvitationCard token="tok" />
    </MemoryRouter>,
  );
  return { mutate };
}

describe('AcceptInvitationCard', () => {
  it('asks a visitor to sign in or sign up with the invited address', () => {
    setup(null);
    expect(screen.getByText('Ana invited bo@example.com as Editor.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create an account' })).toBeInTheDocument();
  });

  it('accepts for the invited account, whatever the case', async () => {
    const { mutate } = setup('Bo@Example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Accept invitation' }));
    expect(mutate).toHaveBeenCalledWith('tok', expect.any(Object));
  });

  it('asks another account to sign out', () => {
    setup('eve@example.com');
    expect(screen.queryByRole('button', { name: 'Accept invitation' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('explains a dead link', () => {
    setup(null, true);
    expect(screen.getByText('This invitation cannot be used')).toBeInTheDocument();
  });
});
