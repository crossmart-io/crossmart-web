import { render, screen } from '@testing-library/react';
import { BillingInterval, SubscriptionAccessState, SubscriptionStatus } from '@/api/schema';
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
  access: {
    state: SubscriptionAccessState.trialing,
    writable: true,
    enforced: true,
    until: '2026-11-14T00:00:00.000Z',
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
    expect(screen.getByRole('button', { name: 'Manage billing' })).toBeInTheDocument();
  });

  it('says when a canceled subscription ends instead of renewing', () => {
    render(
      <BillingStatusCard
        now={NOW}
        status={{
          ...TRIAL,
          status: SubscriptionStatus.ACTIVE,
          cancelAtPeriodEnd: true,
          access: { ...TRIAL.access, state: SubscriptionAccessState.active, until: null },
        }}
      />,
    );
    expect(screen.getByText(/it will not renew/)).toBeInTheDocument();
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
