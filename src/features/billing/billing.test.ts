import { BillingInterval, SubscriptionStatus } from '@/api/schema';
import { daysUntil, hasLiveSubscription, priceOf } from './billing';
import type { BillingPlan } from './billing.types';

describe('daysUntil', () => {
  it('rounds up, and never goes below zero', () => {
    const now = new Date('2026-11-10T12:00:00.000Z');
    expect(daysUntil('2026-11-13T00:00:00.000Z', now)).toBe(3);
    expect(daysUntil('2026-11-01T00:00:00.000Z', now)).toBe(0);
  });
});

describe('priceOf', () => {
  it('finds the price for the interval', () => {
    const plan = {
      prices: [
        { interval: BillingInterval.ANNUAL, amount: 27600, monthlyAmount: 2300, currency: 'usd' },
      ],
    } as BillingPlan;
    expect(priceOf(plan, BillingInterval.ANNUAL)?.monthlyAmount).toBe(2300);
    expect(priceOf(plan, BillingInterval.MONTHLY)).toBeUndefined();
  });
});

describe('hasLiveSubscription', () => {
  it('is true for a started subscription with a billing account', () => {
    expect(hasLiveSubscription(SubscriptionStatus.PAST_DUE, true)).toBe(true);
    expect(hasLiveSubscription(SubscriptionStatus.CANCELED, true)).toBe(false);
    expect(hasLiveSubscription(SubscriptionStatus.ACTIVE, false)).toBe(false);
  });
});
