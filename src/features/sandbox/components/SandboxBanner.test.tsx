import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as Workspaces from '@/features/workspaces';
import { useCurrentWorkspace } from '@/features/workspaces';
import { useClaimAsOwner } from '../hooks/useSandboxClaim';
import { SandboxBanner } from './SandboxBanner';

vi.mock('@/features/workspaces', async (importOriginal) => ({
  ...(await importOriginal<typeof Workspaces>()),
  useCurrentWorkspace: vi.fn<typeof useCurrentWorkspace>(),
}));
vi.mock('../hooks/useSandboxClaim', () => ({ useClaimAsOwner: vi.fn<typeof useClaimAsOwner>() }));

function setup(sandbox: { claimExpiresAt: string } | null) {
  const mutate = vi.fn<(workspaceId: string) => void>();
  vi.mocked(useCurrentWorkspace).mockReturnValue({
    workspace: { id: 'ws-1', sandbox },
  } as unknown as ReturnType<typeof useCurrentWorkspace>);
  vi.mocked(useClaimAsOwner).mockReturnValue({
    mutate,
    isPending: false,
    error: null,
  } as unknown as ReturnType<typeof useClaimAsOwner>);
  const { container } = render(<SandboxBanner />);
  return { mutate, container };
}

describe('SandboxBanner', () => {
  it('shows nothing in a normal workspace', () => {
    expect(setup(null).container).toBeEmptyDOMElement();
  });

  it('asks the owner of a sandbox to claim it, and claims on click', async () => {
    const { mutate } = setup({ claimExpiresAt: '2026-11-21T10:00:00Z' });
    expect(screen.getByText('Sandbox: claim this account')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Claim this account' }));
    expect(mutate).toHaveBeenCalledWith('ws-1', expect.anything());
  });
});
