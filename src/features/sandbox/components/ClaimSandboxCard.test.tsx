import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type * as Auth from '@/features/auth';
import { useSession } from '@/features/auth';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import {
  useClaimAsOwner,
  useClaimWithPassword,
  useSandboxClaimPreview,
} from '../hooks/useSandboxClaim';
import { ClaimSandboxCard } from './ClaimSandboxCard';

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof Auth>()),
  useSession: vi.fn<typeof useSession>(),
}));
vi.mock('@/features/auth/hooks/useSignOut', () => ({ useSignOut: vi.fn<typeof useSignOut>() }));
vi.mock('../hooks/useSandboxClaim', () => ({
  useSandboxClaimPreview: vi.fn<typeof useSandboxClaimPreview>(),
  useClaimWithPassword: vi.fn<typeof useClaimWithPassword>(),
  useClaimAsOwner: vi.fn<typeof useClaimAsOwner>(),
}));

const PREVIEW = {
  workspaceId: 'ws-1',
  email: 'ana@example.com',
  storeName: 'Ana Ceramics',
  claimExpiresAt: '2026-11-21T10:00:00Z',
  passwordSet: false,
};

const IDLE_MUTATION = { mutate: vi.fn<() => void>(), isPending: false, error: null };

function setup(options: { sessionEmail?: string; passwordSet?: boolean; invalid?: boolean }) {
  vi.mocked(useSandboxClaimPreview).mockReturnValue({
    data: options.invalid ? undefined : { ...PREVIEW, passwordSet: options.passwordSet ?? false },
    isPending: false,
    isError: options.invalid ?? false,
  } as unknown as ReturnType<typeof useSandboxClaimPreview>);
  vi.mocked(useSession).mockReturnValue({
    data: options.sessionEmail ? { user: { email: options.sessionEmail } } : null,
    isPending: false,
  } as unknown as ReturnType<typeof useSession>);
  for (const hook of [useClaimWithPassword, useClaimAsOwner, useSignOut]) {
    vi.mocked(hook).mockReturnValue(IDLE_MUTATION as never);
  }
  render(
    <MemoryRouter>
      <ClaimSandboxCard token="token-1" />
    </MemoryRouter>,
  );
}

describe('ClaimSandboxCard', () => {
  it('says what was opened and asks for a password when there is none yet', () => {
    setup({});
    expect(screen.getByRole('heading', { name: 'Claim Ana Ceramics' })).toBeInTheDocument();
    expect(screen.getByText(/An AI agent opened this Crossmart account/)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Claim account' })).toBeInTheDocument();
  });

  it('asks someone with a password to sign in first', () => {
    setup({ passwordSet: true });
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('lets the signed-in owner claim at once', () => {
    setup({ passwordSet: true, sessionEmail: 'Ana@example.com' });
    expect(screen.getByRole('button', { name: 'Claim this account' })).toBeInTheDocument();
  });

  it('asks another account to sign out', () => {
    setup({ passwordSet: true, sessionEmail: 'bo@example.com' });
    expect(screen.getByText(/signed in as bo@example.com/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('explains a link that no longer works', () => {
    setup({ invalid: true });
    expect(screen.getByRole('heading', { name: 'This link cannot be used' })).toBeInTheDocument();
  });
});
