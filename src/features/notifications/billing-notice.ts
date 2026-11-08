import { SubscriptionAccessState } from '@/api/schema';
import { ROUTES } from '@/config/routes';
import {
  cancelledTrialNote,
  daysUntil,
  READ_ONLY_FALLBACK_REASON,
  READ_ONLY_REASONS,
  type SubscriptionAccess,
} from '@/features/billing';
import { formatDate, pluralize } from '@/lib/format';
import { noticeRevision } from './notice-revision';
import { BILLING_NOTICE_COPY as COPY, DEADLINE_BANNER_DAYS } from './notifications.constants';
import {
  type AccountNotice,
  type NoticeAction,
  NoticeActionKind,
  NoticeKind,
  NoticeSeverity,
} from './notifications.types';

export interface BillingNoticeInput {
  access: SubscriptionAccess;
  organizationId: string;
  /** Billing admins get a link to Billing; everyone else is told whom to ask. */
  canManage: boolean;
  now: Date;
}

type BillingNoticeContent = Omit<AccountNotice, 'key' | 'action'> & { actionLabel: string };

function linkToBilling(label: string, canManage: boolean): NoticeAction | null {
  return canManage ? { kind: NoticeActionKind.Link, label, to: ROUTES.billing } : null;
}

/** Whether the deadline is close enough to show as a banner too. */
function isClose(until: string, now: Date): boolean {
  return daysUntil(until, now) <= DEADLINE_BANNER_DAYS;
}

/** A deadline is informational until it is close; then it is a banner too. */
function deadline(close: boolean): Pick<AccountNotice, 'severity' | 'banner'> {
  return { severity: close ? NoticeSeverity.Warning : NoticeSeverity.Info, banner: close };
}

/** What happens when the trial ends: the card is charged, unless a cancellation is scheduled. */
function trial(access: SubscriptionAccess, until: string, now: Date): BillingNoticeContent {
  const body = access.cancelAt
    ? cancelledTrialNote(access.cancelAt)
    : COPY.trialCharged(pluralize(daysUntil(until, now), 'day'), formatDate(until));
  const close = isClose(until, now);
  return {
    kind: NoticeKind.Trial,
    title: COPY.trialTitle,
    body,
    revision: noticeRevision(until, access.cancelAt, close),
    actionLabel: COPY.manageBilling,
    ...deadline(close),
  };
}

function paymentFailed(until: string | null, canManage: boolean): BillingNoticeContent {
  const by = until ? COPY.paymentFailedBy(formatDate(until)) : '';
  return {
    kind: NoticeKind.PaymentFailed,
    severity: NoticeSeverity.Warning,
    banner: true,
    title: COPY.paymentFailedTitle,
    body: COPY.paymentFailed(by, canManage),
    revision: noticeRevision(until),
    actionLabel: COPY.updatePaymentMethod,
  };
}

function legacyEnding(until: string, now: Date): BillingNoticeContent {
  const close = isClose(until, now);
  return {
    kind: NoticeKind.LegacyAccessEnding,
    title: COPY.choosePlanTitle,
    body: COPY.legacyEnding(formatDate(until)),
    revision: noticeRevision(until, close),
    actionLabel: COPY.choosePlan,
    ...deadline(close),
  };
}

/**
 * Without a working subscription: read-only once enforced, and before that an invitation to choose
 * a plan, which blocks nothing yet and so stays in the bell.
 */
function inactive(access: SubscriptionAccess, canManage: boolean): BillingNoticeContent {
  const reason = READ_ONLY_REASONS[access.state] ?? READ_ONLY_FALLBACK_REASON;
  if (!access.enforced) {
    return {
      kind: NoticeKind.PlanRequired,
      severity: NoticeSeverity.Info,
      banner: false,
      title: COPY.choosePlanTitle,
      body: COPY.planRequired(reason),
      revision: noticeRevision(access.state),
      actionLabel: COPY.choosePlan,
    };
  }
  return {
    kind: NoticeKind.ReadOnly,
    severity: NoticeSeverity.Danger,
    banner: true,
    title: COPY.readOnlyTitle,
    body: COPY.readOnly(reason, canManage),
    revision: noticeRevision(access.state),
    actionLabel: COPY.fixBilling,
  };
}

function content(input: BillingNoticeInput): BillingNoticeContent | null {
  const { access, canManage, now } = input;
  const { state, until } = access;
  if (state === SubscriptionAccessState.trialing && until) return trial(access, until, now);
  if (state === SubscriptionAccessState.past_due_grace) return paymentFailed(until, canManage);
  if (state === SubscriptionAccessState.legacy && until) return legacyEnding(until, now);
  return access.writable ? null : inactive(access, canManage);
}

/**
 * The notice the organization's billing calls for, or null when nothing needs saying: billing
 * off, an active subscription, a sandbox, or access from before billing with no end date.
 */
export function billingNotice(input: BillingNoticeInput): AccountNotice | null {
  const found = content(input);
  if (!found) return null;
  const { actionLabel, ...notice } = found;
  return {
    ...notice,
    key: `${notice.kind}:${input.organizationId}`,
    action: linkToBilling(actionLabel, input.canManage),
  };
}
