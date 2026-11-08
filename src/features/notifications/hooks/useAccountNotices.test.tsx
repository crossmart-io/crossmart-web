import { renderHook } from '@testing-library/react';
import { SubscriptionAccessState, WorkspacePermission } from '@/api/schema';
import type * as Auth from '@/features/auth';
import { useSession } from '@/features/auth';
import type * as Billing from '@/features/billing';
import { type SubscriptionAccess, useBillingAccess } from '@/features/billing';
import type * as Workspaces from '@/features/workspaces';
import { useCurrentWorkspace, type Workspace } from '@/features/workspaces';
import { NoticeActionKind, NoticeKind, NoticeSeverity } from '../notifications.types';
import { useAccountNotices } from './useAccountNotices';

vi.mock('@/features/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof Auth>()),
  useSession: vi.fn<typeof useSession>(),
}));
vi.mock('@/features/workspaces', async (importOriginal) => ({
  ...(await importOriginal<typeof Workspaces>()),
  useCurrentWorkspace: vi.fn<typeof useCurrentWorkspace>(),
}));
vi.mock('@/features/billing', async (importOriginal) => ({
  ...(await importOriginal<typeof Billing>()),
  useBillingAccess: vi.fn<typeof useBillingAccess>(),
}));

const NOW = new Date('2026-11-10T12:00:00.000Z');
const USER = { id: 'user-1', email: 'dana@example.com', emailVerified: true };
const ACTIVE: SubscriptionAccess = {
  state: SubscriptionAccessState.active,
  writable: true,
  enforced: true,
  until: null,
  cancelAt: null,
};

interface Setup {
  emailVerified?: boolean;
  sandbox?: { claimExpiresAt: string } | null;
  access?: Partial<SubscriptionAccess>;
  canManageBilling?: boolean;
}

function notices({ emailVerified = true, sandbox = null, access, canManageBilling = true }: Setup) {
  vi.mocked(useSession).mockReturnValue({
    data: { user: { ...USER, emailVerified } },
  } as unknown as ReturnType<typeof useSession>);
  const workspace = {
    id: 'ws-1',
    organizationId: 'org-1',
    sandbox,
    permissions: canManageBilling ? [WorkspacePermission.billing_manage] : [],
  } as unknown as Workspace;
  vi.mocked(useCurrentWorkspace).mockReturnValue({ workspace } as ReturnType<
    typeof useCurrentWorkspace
  >);
  vi.mocked(useBillingAccess).mockReturnValue({
    data: { ...ACTIVE, ...access },
  } as unknown as ReturnType<typeof useBillingAccess>);
  return renderHook(() => useAccountNotices()).result.current;
}

describe('useAccountNotices', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
  });
  afterEach(() => vi.useRealTimers());

  it('has nothing to say for a verified user on an active plan', () => {
    expect(notices({})).toEqual([]);
  });

  it('asks to confirm the email, in the bell only', () => {
    expect(notices({ emailVerified: false })).toEqual([
      expect.objectContaining({
        key: `${NoticeKind.VerifyEmail}:${USER.id}`,
        severity: NoticeSeverity.Info,
        banner: false,
        action: { kind: NoticeActionKind.ResendVerification, email: USER.email },
      }),
    ]);
  });

  it('keeps a sandbox to claim on the page', () => {
    expect(notices({ sandbox: { claimExpiresAt: '2026-11-21T10:00:00Z' } })).toEqual([
      expect.objectContaining({
        kind: NoticeKind.SandboxClaim,
        banner: true,
        action: { kind: NoticeActionKind.ClaimSandbox, workspaceId: 'ws-1' },
      }),
    ]);
  });

  it.each([
    [SubscriptionAccessState.trialing, '2026-11-24T00:00:00Z', NoticeKind.Trial, false],
    [SubscriptionAccessState.trialing, '2026-11-12T00:00:00Z', NoticeKind.Trial, true],
    [SubscriptionAccessState.legacy, '2026-12-31T00:00:00Z', NoticeKind.LegacyAccessEnding, false],
    [SubscriptionAccessState.past_due_grace, null, NoticeKind.PaymentFailed, true],
  ])('for %s until %s says %s (banner: %s)', (state, until, kind, banner) => {
    expect(notices({ access: { state, until } })).toEqual([
      expect.objectContaining({ kind, banner }),
    ]);
  });

  it('keeps a read-only account on the page, without a link for those who cannot fix it', () => {
    const access = { state: SubscriptionAccessState.unpaid, writable: false };
    expect(notices({ access, canManageBilling: false })).toEqual([
      expect.objectContaining({
        kind: NoticeKind.ReadOnly,
        severity: NoticeSeverity.Danger,
        banner: true,
        action: null,
      }),
    ]);
  });

  it('asks for a plan in the bell only while limits are not enforced', () => {
    const access = { state: SubscriptionAccessState.subscription_required, writable: false };
    expect(notices({ access: { ...access, enforced: false } })).toEqual([
      expect.objectContaining({ kind: NoticeKind.PlanRequired, banner: false }),
    ]);
  });

  it('lists the most urgent first', () => {
    const kinds = notices({
      emailVerified: false,
      sandbox: { claimExpiresAt: '2026-11-21T10:00:00Z' },
      access: { state: SubscriptionAccessState.canceled, writable: false },
    }).map((notice) => notice.kind);
    expect(kinds).toEqual([NoticeKind.ReadOnly, NoticeKind.SandboxClaim, NoticeKind.VerifyEmail]);
  });
});
