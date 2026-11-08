import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { useClaimAsOwner } from '@/features/sandbox/hooks/useSandboxClaim';
import { useAccountNotices } from '../hooks/useAccountNotices';
import {
  type AccountNotice,
  NoticeActionKind,
  NoticeKind,
  NoticeSeverity,
} from '../notifications.types';
import { AccountNoticeBanners } from './AccountNoticeBanners';

vi.mock('../hooks/useAccountNotices', () => ({
  useAccountNotices: vi.fn<typeof useAccountNotices>(),
}));
vi.mock('@/features/sandbox/hooks/useSandboxClaim', () => ({
  useClaimAsOwner: vi.fn<typeof useClaimAsOwner>(),
}));

const SANDBOX: AccountNotice = {
  key: `${NoticeKind.SandboxClaim}:ws-1`,
  kind: NoticeKind.SandboxClaim,
  severity: NoticeSeverity.Warning,
  banner: true,
  title: 'Sandbox: claim this account',
  body: 'An AI agent opened this account for you.',
  action: { kind: NoticeActionKind.ClaimSandbox, workspaceId: 'ws-1' },
};
const TRIAL: AccountNotice = {
  key: `${NoticeKind.Trial}:org-1`,
  kind: NoticeKind.Trial,
  severity: NoticeSeverity.Info,
  banner: false,
  title: 'Free trial',
  body: 'Your trial ends in 10 days.',
  action: null,
};

function banners(notices: AccountNotice[]) {
  vi.mocked(useAccountNotices).mockReturnValue(notices);
  const mutate = vi.fn<(workspaceId: string) => void>();
  vi.mocked(useClaimAsOwner).mockReturnValue({
    mutate,
    isPending: false,
    error: null,
  } as unknown as ReturnType<typeof useClaimAsOwner>);
  const { container } = render(
    <MemoryRouter>
      <AccountNoticeBanners />
    </MemoryRouter>,
  );
  return { mutate, container };
}

describe('AccountNoticeBanners', () => {
  it('leaves informational notices to the bell', () => {
    expect(banners([TRIAL]).container).toBeEmptyDOMElement();
  });

  it('shows blocking notices with their action', async () => {
    const { mutate } = banners([SANDBOX, TRIAL]);
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(screen.getByText(SANDBOX.title)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Claim this account' }));
    expect(mutate).toHaveBeenCalledWith('ws-1', expect.anything());
  });
});
