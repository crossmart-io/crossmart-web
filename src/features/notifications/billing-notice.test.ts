import { SubscriptionAccessState } from '@/api/schema';
import { ROUTES } from '@/config/routes';
import type { SubscriptionAccess } from '@/features/billing';
import { formatDate } from '@/lib/format';
import { billingNotice } from './billing-notice';
import { NoticeActionKind, NoticeKind, NoticeSeverity } from './notifications.types';

const NOW = new Date('2026-11-10T12:00:00.000Z');
const ORGANIZATION_ID = 'org-1';

function access(overrides: Partial<SubscriptionAccess>): SubscriptionAccess {
  return {
    state: SubscriptionAccessState.active,
    writable: true,
    enforced: true,
    until: null,
    cancelAt: null,
    ...overrides,
  };
}

function noticeFor(overrides: Partial<SubscriptionAccess>, canManage = true, now = NOW) {
  return billingNotice({
    access: access(overrides),
    organizationId: ORGANIZATION_ID,
    canManage,
    now,
  });
}

const DAY_MS = 86_400_000;
const TRIAL_END = '2026-11-20T00:00:00.000Z';

function trialOn(daysLater: number, cancelAt: string | null = null) {
  const now = new Date(NOW.getTime() + daysLater * DAY_MS);
  return noticeFor(
    { state: SubscriptionAccessState.trialing, until: TRIAL_END, cancelAt },
    true,
    now,
  );
}

describe('billingNotice', () => {
  it.each([
    SubscriptionAccessState.unrestricted,
    SubscriptionAccessState.active,
    SubscriptionAccessState.sandbox,
    SubscriptionAccessState.legacy,
  ])('says nothing for %s with no end date', (state) => {
    expect(noticeFor({ state })).toBeNull();
  });

  it('counts down the trial in the bell only, with a link to Billing', () => {
    const notice = noticeFor({
      state: SubscriptionAccessState.trialing,
      until: '2026-11-20T00:00:00.000Z',
    });
    expect(notice).toMatchObject({
      key: `${NoticeKind.Trial}:${ORGANIZATION_ID}`,
      kind: NoticeKind.Trial,
      severity: NoticeSeverity.Info,
      banner: false,
      title: 'Free trial',
      action: { kind: NoticeActionKind.Link, label: 'Manage billing', to: ROUTES.billing },
    });
    expect(notice?.body).toContain('10 days');
    expect(notice?.body).toContain('Your card is charged then');
  });

  it('shows the trial as a banner too in its last three days', () => {
    const notice = noticeFor({
      state: SubscriptionAccessState.trialing,
      until: '2026-11-13T00:00:00.000Z',
    });
    expect(notice).toMatchObject({ banner: true, severity: NoticeSeverity.Warning });
    expect(notice?.body).toContain('3 days');
  });

  it('keeps the trial revision while only the countdown changes', () => {
    const today = trialOn(0);
    const tomorrow = trialOn(1);
    expect(tomorrow?.body).not.toBe(today?.body);
    expect(tomorrow?.revision).toBe(today?.revision);
  });

  it('changes the trial revision once on entering the banner window, and on cancelling', () => {
    expect(trialOn(7)?.revision).not.toBe(trialOn(6)?.revision);
    expect(trialOn(8)?.revision).toBe(trialOn(7)?.revision);
    expect(trialOn(0, TRIAL_END)?.revision).not.toBe(trialOn(0)?.revision);
  });

  it('says a cancelled trial ends without a charge', () => {
    const trialEnd = '2026-11-20T00:00:00.000Z';
    const notice = noticeFor({
      state: SubscriptionAccessState.trialing,
      until: trialEnd,
      cancelAt: trialEnd,
    });
    expect(notice?.body).toBe(
      `Your trial ends on ${formatDate(trialEnd)} and you won't be charged.`,
    );
    expect(notice?.banner).toBe(false);
  });

  it('keeps a failed payment on the page, and tells others whom to ask', () => {
    const notice = noticeFor(
      { state: SubscriptionAccessState.past_due_grace, until: '2026-11-17T00:00:00.000Z' },
      false,
    );
    expect(notice).toMatchObject({
      kind: NoticeKind.PaymentFailed,
      severity: NoticeSeverity.Warning,
      banner: true,
      action: null,
    });
    expect(notice?.body).toContain('Ask an owner or admin');
  });

  it('warns when free access from before billing has an end date', () => {
    expect(
      noticeFor({ state: SubscriptionAccessState.legacy, until: '2026-12-31T00:00:00.000Z' }),
    ).toMatchObject({
      kind: NoticeKind.LegacyAccessEnding,
      banner: false,
      title: 'Choose a plan',
      action: { label: 'Choose a plan' },
    });
  });

  it('says the account is read-only once enforced, and asks for a plan before', () => {
    const canceled = { state: SubscriptionAccessState.canceled, writable: false };
    expect(noticeFor(canceled)).toMatchObject({
      kind: NoticeKind.ReadOnly,
      severity: NoticeSeverity.Danger,
      banner: true,
      title: 'This account is read-only',
      action: { label: 'Fix billing' },
    });
    expect(noticeFor({ ...canceled, enforced: false })).toMatchObject({
      kind: NoticeKind.PlanRequired,
      banner: false,
      title: 'Choose a plan',
    });
  });
});
