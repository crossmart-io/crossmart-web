import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ROUTES } from '@/config/routes';
import type * as Auth from '@/features/auth';
import { useSession } from '@/features/auth';
import { useResendVerification } from '@/features/auth/hooks/useResendVerification';
import { useAccountNotices } from '../hooks/useAccountNotices';
import {
  type AccountNotice,
  NoticeActionKind,
  NoticeKind,
  NoticeSeverity,
} from '../notifications.types';
import { NotificationBell } from './NotificationBell';

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof Auth>()),
  useSession: vi.fn<typeof useSession>(),
}));
vi.mock('@/features/auth/hooks/useResendVerification', () => ({
  useResendVerification: vi.fn<typeof useResendVerification>(),
}));
vi.mock('../hooks/useAccountNotices', () => ({
  useAccountNotices: vi.fn<typeof useAccountNotices>(),
}));

const EMAIL = 'dana@example.com';
const TRIAL: AccountNotice = {
  key: `${NoticeKind.Trial}:org-1`,
  kind: NoticeKind.Trial,
  severity: NoticeSeverity.Info,
  banner: false,
  title: 'Free trial',
  body: 'Your trial ends in 10 days, on Nov 20, 2026. Your card is charged then.',
  action: { kind: NoticeActionKind.Link, label: 'Manage billing', to: ROUTES.billing },
};
const VERIFY_EMAIL: AccountNotice = {
  key: `${NoticeKind.VerifyEmail}:user`,
  kind: NoticeKind.VerifyEmail,
  severity: NoticeSeverity.Info,
  banner: false,
  title: 'Confirm your email',
  body: `We sent a link to ${EMAIL}.`,
  action: { kind: NoticeActionKind.ResendVerification, email: EMAIL },
};

let userCount = 0;
const resend = vi.fn<(email: string) => void>();

function bell(notices: AccountNotice[]) {
  userCount += 1;
  vi.mocked(useSession).mockReturnValue({
    data: { user: { id: `user-${userCount}` } },
  } as unknown as ReturnType<typeof useSession>);
  vi.mocked(useAccountNotices).mockReturnValue(notices);
  const ui = () => (
    <QueryClientProvider client={new QueryClient()}>
      <TooltipProvider>
        <MemoryRouter>
          <NotificationBell />
          <Routes>
            <Route path={ROUTES.billing} element={<p>Billing page</p>} />
            <Route path="*" element={null} />
          </Routes>
        </MemoryRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
  const view = render(ui());
  return { rerender: () => view.rerender(ui()) };
}

function bellButton() {
  return screen.getByRole('button', { name: /^Notifications/ });
}

describe('NotificationBell', () => {
  beforeEach(() => {
    localStorage.clear();
    resend.mockReset();
    vi.mocked(useResendVerification).mockReturnValue({
      mutate: resend,
      isPending: false,
      isSuccess: false,
    } as unknown as ReturnType<typeof useResendVerification>);
  });

  it('counts the notices not yet seen in its label and badge', () => {
    bell([TRIAL, VERIFY_EMAIL]);
    expect(bellButton()).toHaveAccessibleName('Notifications, 2 new');
    expect(bellButton()).toHaveTextContent('2');
  });

  it('lists the notices when opened, and clears the badge for good', async () => {
    bell([TRIAL, VERIFY_EMAIL]);
    await userEvent.click(bellButton());

    const list = screen.getByRole('list', { name: 'Notifications' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(within(list).getByText(TRIAL.body)).toBeInTheDocument();
    expect(bellButton()).toHaveAccessibleName('Notifications');
    expect(bellButton()).not.toHaveTextContent('2');
    expect(localStorage.length).toBe(1);
  });

  it('counts a notice whose content changed as new again', async () => {
    const { rerender } = bell([TRIAL]);
    await userEvent.click(bellButton());
    await userEvent.keyboard('{Escape}');

    vi.mocked(useAccountNotices).mockReturnValue([{ ...TRIAL, body: 'Ends in 3 days.' }]);
    rerender();
    expect(bellButton()).toHaveAccessibleName('Notifications, 1 new');
  });

  it('says when there is nothing to see', async () => {
    bell([]);
    expect(bellButton()).toHaveAccessibleName('Notifications');
    await userEvent.click(bellButton());
    expect(screen.getByText("You're all caught up.")).toBeInTheDocument();
  });

  it('follows a link action and closes', async () => {
    bell([TRIAL]);
    await userEvent.click(bellButton());
    await userEvent.click(screen.getByRole('link', { name: 'Manage billing' }));

    expect(screen.getByText('Billing page')).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Notifications' })).not.toBeInTheDocument();
  });

  it('sends the confirmation email again', async () => {
    bell([VERIFY_EMAIL]);
    await userEvent.click(bellButton());
    await userEvent.click(screen.getByRole('button', { name: 'Send it again' }));
    expect(resend).toHaveBeenCalledWith(EMAIL);
  });

  it('opens from the keyboard and returns focus to the bell on Escape', async () => {
    bell([TRIAL]);
    await userEvent.tab();
    expect(bellButton()).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(bellButton()).toHaveFocus();
  });

  it('still clears the badge when storage is blocked', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    bell([TRIAL]);
    await userEvent.click(bellButton());
    expect(bellButton()).toHaveAccessibleName('Notifications');
    setItem.mockRestore();
  });
});
