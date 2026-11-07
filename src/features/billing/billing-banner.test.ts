import { SubscriptionAccessState } from '@/api/schema';
import { BannerTone, billingBanner } from './billing-banner';
import type { SubscriptionAccess } from './billing.types';

const NOW = new Date('2026-11-10T12:00:00.000Z');

function access(overrides: Partial<SubscriptionAccess>): SubscriptionAccess {
  return {
    state: SubscriptionAccessState.active,
    writable: true,
    enforced: true,
    until: null,
    ...overrides,
  };
}

describe('billingBanner', () => {
  it.each([
    SubscriptionAccessState.unrestricted,
    SubscriptionAccessState.active,
    SubscriptionAccessState.sandbox,
    SubscriptionAccessState.legacy,
  ])('says nothing for %s with no end date', (state) => {
    expect(billingBanner(access({ state }), true, NOW)).toBeNull();
  });

  it('counts down the trial', () => {
    const banner = billingBanner(
      access({ state: SubscriptionAccessState.trialing, until: '2026-11-14T00:00:00.000Z' }),
      true,
      NOW,
    );
    expect(banner).toMatchObject({
      tone: BannerTone.Info,
      title: 'Free trial',
      action: 'Manage billing',
    });
    expect(banner?.body).toContain('4 days');
  });

  it('asks for a new card while a payment is past due', () => {
    const banner = billingBanner(
      access({ state: SubscriptionAccessState.past_due_grace, until: '2026-11-17T00:00:00.000Z' }),
      false,
      NOW,
    );
    expect(banner).toMatchObject({ tone: BannerTone.Warning, action: null });
    expect(banner?.body).toContain('Ask an owner or admin');
  });

  it('warns when free access from before billing has an end date', () => {
    expect(
      billingBanner(
        access({ state: SubscriptionAccessState.legacy, until: '2026-12-31T00:00:00.000Z' }),
        true,
        NOW,
      ),
    ).toMatchObject({ title: 'Choose a plan', action: 'Choose a plan' });
  });

  it('says the account is read-only once enforced, and only invites a plan before', () => {
    const canceled = { state: SubscriptionAccessState.canceled, writable: false };
    expect(billingBanner(access(canceled), true, NOW)).toMatchObject({
      tone: BannerTone.Danger,
      title: 'This account is read-only',
      action: 'Fix billing',
    });
    expect(billingBanner(access({ ...canceled, enforced: false }), true, NOW)).toMatchObject({
      tone: BannerTone.Info,
      title: 'Choose a plan',
    });
  });
});
