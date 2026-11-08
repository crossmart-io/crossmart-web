import { Bot, BotMessageSquare, CreditCard, type LucideIcon, MailWarning } from 'lucide-react';
import { NoticeKind, NoticeSeverity } from './notifications.types';

/** A trial or free access ending within this many days is also shown as a banner. */
export const DEADLINE_BANNER_DAYS = 3;

/** Per user: the notices they have seen, each with the revision they saw. */
export const SEEN_NOTICES_STORAGE_KEY = 'crossmart.seen-notices';

/** Joins a notice's facts into its revision. */
export const REVISION_SEPARATOR = '|';

/** The bell lists the most urgent notices first. */
export const SEVERITY_RANK: Record<NoticeSeverity, number> = {
  [NoticeSeverity.Danger]: 0,
  [NoticeSeverity.Warning]: 1,
  [NoticeSeverity.Info]: 2,
};

export const NOTICE_ICONS: Record<NoticeKind, LucideIcon> = {
  [NoticeKind.SandboxClaim]: Bot,
  [NoticeKind.Trial]: CreditCard,
  [NoticeKind.PaymentFailed]: CreditCard,
  [NoticeKind.LegacyAccessEnding]: CreditCard,
  [NoticeKind.PlanRequired]: CreditCard,
  [NoticeKind.ReadOnly]: CreditCard,
  [NoticeKind.VerifyEmail]: MailWarning,
  [NoticeKind.AgentProposals]: BotMessageSquare,
};

export const NOTICE_ICON_TONES: Record<NoticeSeverity, string> = {
  [NoticeSeverity.Info]: 'text-muted-foreground',
  [NoticeSeverity.Warning]: 'text-warning',
  [NoticeSeverity.Danger]: 'text-destructive',
};

/** The bell and its popover. */
export const BELL_COPY = {
  label: 'Notifications',
  labelWithNew: (count: number) => `Notifications, ${count} new`,
  title: 'Notifications',
  empty: "You're all caught up.",
  /** The badge stops counting here. */
  maxCount: 9,
} as const;

const ASK_ADMIN = 'Ask an owner or admin of the organization to fix billing.';

export const BILLING_NOTICE_COPY = {
  trialTitle: 'Free trial',
  trialCharged: (days: string, date: string) =>
    `Your trial ends in ${days}, on ${date}. Your card is charged then.`,
  paymentFailedTitle: 'A payment failed',
  paymentFailed: (by: string, canManage: boolean) =>
    `Update the payment method${by} to keep making changes.${canManage ? '' : ` ${ASK_ADMIN}`}`,
  paymentFailedBy: (date: string) => ` by ${date}`,
  choosePlanTitle: 'Choose a plan',
  legacyEnding: (date: string) =>
    `Your free access ends on ${date}. Choose a plan to keep making changes after that.`,
  planRequired: (reason: string) => `${reason} Choose a plan to keep using Crossmart.`,
  readOnlyTitle: 'This account is read-only',
  readOnly: (reason: string, canManage: boolean) =>
    `${reason} You can see everything but not make changes. ${canManage ? 'Choose a plan to make changes again.' : ASK_ADMIN}`,
  manageBilling: 'Manage billing',
  updatePaymentMethod: 'Update payment method',
  choosePlan: 'Choose a plan',
  fixBilling: 'Fix billing',
} as const;

export const SANDBOX_NOTICE_COPY = {
  title: 'Sandbox: claim this account',
  body: (date: string) =>
    `An AI agent opened this account for you. Claim it to connect stores, publish and invite people. Until then it is deleted on ${date}.`,
} as const;

export const VERIFY_EMAIL_NOTICE_COPY = {
  title: 'Confirm your email',
  body: (email: string) =>
    `We sent a link to ${email}. Confirming it lets you reset your password later.`,
} as const;

export const AGENT_PROPOSALS_NOTICE_COPY = {
  title: 'Agent proposals are waiting',
  body: (count: number) =>
    count === 1
      ? 'An AI agent proposed a change. Nothing changes until you approve it.'
      : `AI agents proposed ${count} changes. Nothing changes until you approve them.`,
  review: 'Review',
} as const;
