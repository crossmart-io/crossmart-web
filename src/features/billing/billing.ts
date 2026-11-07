import { type BillingInterval, type SubscriptionStatus } from '@/api/schema';
import { LIVE_STATUSES, MS_PER_DAY } from './billing.constants';
import type { BillingPlan, PlanPrice } from './billing.types';

/** Whole days left until `until`, rounded up, and never below zero. */
export function daysUntil(until: string, now: Date): number {
  return Math.max(0, Math.ceil((new Date(until).getTime() - now.getTime()) / MS_PER_DAY));
}

/** The plan's price for the interval, if it is sold that way. */
export function priceOf(plan: BillingPlan, interval: BillingInterval): PlanPrice | undefined {
  return plan.prices.find((price) => price.interval === interval);
}

/** Whether the organization has a subscription that changes in the billing portal. */
export function hasLiveSubscription(
  status: SubscriptionStatus,
  hasBillingAccount: boolean,
): boolean {
  return hasBillingAccount && LIVE_STATUSES.has(status);
}
