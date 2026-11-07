import { render, screen } from '@testing-library/react';
import { BillingInterval, SubscriptionAccessState, SubscriptionStatus } from '@/api/schema';
import { formatDate } from '@/lib/format';
import type { BillingStatus } from '../billing.types';
import { BillingStatusCard } from './BillingStatusCard';

vi.mock('../hooks/useHostedBillingPage', () => ({
  useOpenBillingPortal: () => ({ isPending: false, mutate: vi.fn<() => void>() }),
}));

const NOW = new Date('2026-11-10T12:00:00.000Z');

const TRIAL: BillingStatus = {
  organizationId: 'org-1',
  enabled: true,
  plan: { code: 'growth', name: 'Growth', version: 2, offered: true },
  status: SubscriptionStatus.TRIALING,
  interval: BillingInterval.ANNUAL,
  currentPeriodEnd: '2026-11-14T00:00:00.000Z',
  trialEnd: '2026-11-14T00:00:00.000Z',
  cancelAtPeriodEnd: false,
  cancelAt: null,
  access: {
    state: SubscriptionAccessState.trialing,
    writable: true,
    enforced: true,
    until: '2026-11-14T00:00:00.000Z',
    cancelAt: null,
  },
  hasBillingAccount: true,
  trialAvailable: false,
};

describe('BillingStatusCard', () => {
  it('shows the plan, the trial countdown and the way to the billing portal', () => {
    render(<BillingStatusCard status={TRIAL} now={NOW} />);
    expect(screen.getByText('Growth')).toBeInTheDocument();
    expect(screen.getByText('Trial')).toBeInTheDocument();
    expect(screen.getByText('Annual')).toBeInTheDocument();
    expect(screen.getByText(/Trial ends in 4 days/)).toBeInTheDocument();
    expect(screen.getByText(/Your card is charged then/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manage billing' })).toBeInTheDocument();
  });

  it('says a trial cancelled in the portal ends without a charge', () => {
    const trialEnd = '2026-11-14T00:00:00.000Z';
    render(
      <BillingStatusCard
        now={NOW}
        status={{
          ...TRIAL,
          cancelAtPeriodEnd: true,
          cancelAt: trialEnd,
          access: { ...TRIAL.access, cancelAt: trialEnd },
        }}
      />,
    );
    expect(
      screen.getByText(`Your trial ends on ${formatDate(trialEnd)} and you won't be charged.`),
    ).toBeInTheDocument();
    expect(screen.queryByText(/charged then/)).not.toBeInTheDocument();
  });

  it('says when a cancelled subscription ends instead of renewing', () => {
    const cancelAt = '2026-12-07T00:00:00.000Z';
    render(
      <BillingStatusCard
        now={NOW}
        status={{
          ...TRIAL,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodEnd: cancelAt,
          cancelAtPeriodEnd: true,
          cancelAt,
          access: { ...TRIAL.access, state: SubscriptionAccessState.active, until: null, cancelAt },
        }}
      />,
    );
    expect(screen.getByText(`Cancels on ${formatDate(cancelAt)}.`)).toBeInTheDocument();
    expect(screen.queryByText(/Renews on/)).not.toBeInTheDocument();
  });

  it('says nothing about renewing once the subscription has ended', () => {
    render(
      <BillingStatusCard
        now={NOW}
        status={{
          ...TRIAL,
          status: SubscriptionStatus.CANCELED,
          access: { ...TRIAL.access, state: SubscriptionAccessState.canceled, until: null },
        }}
      />,
    );
    expect(screen.queryByText(/Renews on|Cancels on|Trial ends/)).not.toBeInTheDocument();
  });

  it('says when a subscription renews', () => {
    render(
      <BillingStatusCard
        now={NOW}
        status={{
          ...TRIAL,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodEnd: '2026-12-07T00:00:00.000Z',
          access: { ...TRIAL.access, state: SubscriptionAccessState.active, until: null },
        }}
      />,
    );
    expect(screen.getByText(/Renews on/)).toBeInTheDocument();
  });

  it('says billing is off on a self-hosted instance, with no portal', () => {
    render(
      <BillingStatusCard
        now={NOW}
        status={{
          ...TRIAL,
          enabled: false,
          interval: null,
          hasBillingAccount: false,
          status: SubscriptionStatus.ACTIVE,
          access: { ...TRIAL.access, state: SubscriptionAccessState.unrestricted, enforced: false },
        }}
      />,
    );
    expect(screen.getByText(/Billing is off/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Manage billing' })).not.toBeInTheDocument();
  });
});
