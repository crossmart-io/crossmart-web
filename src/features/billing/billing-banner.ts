import { SubscriptionAccessState } from '@/api/schema';
import { formatDate, pluralize } from '@/lib/format';
import { READ_ONLY_FALLBACK_REASON, READ_ONLY_REASONS } from './billing.constants';
import { cancelledTrialNote, daysUntil } from './billing';
import type { SubscriptionAccess } from './billing.types';

export enum BannerTone {
  Info = 'info',
  Warning = 'warning',
  Danger = 'danger',
}

/** What the billing banner says, and the link to Billing for those who can act on it. */
export interface BillingBannerModel {
  tone: BannerTone;
  title: string;
  body: string;
  /** Null when the person cannot fix it themselves. */
  action: string | null;
}

const ASK_ADMIN = 'Ask an owner or admin of the organization to fix billing.';

/** What happens when the trial ends: the card is charged, unless a cancellation is scheduled. */
function trialNote(until: string, cancelAt: string | null, now: Date): string {
  if (cancelAt) return cancelledTrialNote(cancelAt);
  const days = pluralize(daysUntil(until, now), 'day');
  return `Your trial ends in ${days}, on ${formatDate(until)}. Your card is charged then.`;
}

function trialBanner(
  access: SubscriptionAccess,
  until: string,
  now: Date,
  canManage: boolean,
): BillingBannerModel {
  return {
    tone: BannerTone.Info,
    title: 'Free trial',
    body: trialNote(until, access.cancelAt, now),
    action: canManage ? 'Manage billing' : null,
  };
}

function pastDueBanner(until: string | null, canManage: boolean): BillingBannerModel {
  const by = until ? ` by ${formatDate(until)}` : '';
  return {
    tone: BannerTone.Warning,
    title: 'A payment failed',
    body: `Update the payment method${by} to keep making changes.${canManage ? '' : ` ${ASK_ADMIN}`}`,
    action: canManage ? 'Update payment method' : null,
  };
}

function legacyBanner(until: string, canManage: boolean): BillingBannerModel {
  return {
    tone: BannerTone.Info,
    title: 'Choose a plan',
    body: `Your free access ends on ${formatDate(until)}. Choose a plan to keep making changes after that.`,
    action: canManage ? 'Choose a plan' : null,
  };
}

function readOnlyBanner(access: SubscriptionAccess, canManage: boolean): BillingBannerModel {
  const reason = READ_ONLY_REASONS[access.state] ?? READ_ONLY_FALLBACK_REASON;
  const fix = canManage ? 'Choose a plan to make changes again.' : ASK_ADMIN;
  if (!access.enforced) {
    return {
      tone: BannerTone.Info,
      title: 'Choose a plan',
      body: `${reason} Choose a plan to keep using Crossmart.`,
      action: canManage ? 'Choose a plan' : null,
    };
  }
  return {
    tone: BannerTone.Danger,
    title: 'This account is read-only',
    body: `${reason} You can see everything but not make changes. ${fix}`,
    action: canManage ? 'Fix billing' : null,
  };
}

/**
 * The banner the organization's billing calls for, or null when nothing needs saying: billing
 * off, an active subscription, a sandbox, or access from before billing with no end date.
 */
export function billingBanner(
  access: SubscriptionAccess,
  canManage: boolean,
  now: Date,
): BillingBannerModel | null {
  const { state, until } = access;
  if (state === SubscriptionAccessState.trialing && until)
    return trialBanner(access, until, now, canManage);
  if (state === SubscriptionAccessState.past_due_grace) return pastDueBanner(until, canManage);
  if (state === SubscriptionAccessState.legacy && until) return legacyBanner(until, canManage);
  return access.writable ? null : readOnlyBanner(access, canManage);
}
