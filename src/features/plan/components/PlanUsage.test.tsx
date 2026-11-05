import { render, screen } from '@testing-library/react';
import { Feature, FeatureKind, SubscriptionStatus } from '@/api/schema';
import type { FeatureUsage, Subscription } from '../plan.types';
import { PlanFeatureList } from './PlanFeatureList';
import { PlanSummaryCard } from './PlanSummaryCard';
import { UsageMeter } from './UsageMeter';
import { UsageMeterList } from './UsageMeterList';

function limit(feature: Feature, usage: number, max: number | null): FeatureUsage {
  return { feature, kind: FeatureKind.limit, enabled: true, limit: max, usage };
}

function flag(feature: Feature, enabled: boolean): FeatureUsage {
  return { feature, kind: FeatureKind.flag, enabled, limit: enabled ? null : 0, usage: null };
}

const SUBSCRIPTION: Subscription = {
  organizationId: 'org-1',
  plan: { code: 'free', name: 'Free', version: 1 },
  status: SubscriptionStatus.ACTIVE,
  currentPeriodEnd: null,
  enforced: false,
  features: [
    limit(Feature.active_listings, 12, 50),
    limit(Feature.channel_connections, 3, 2),
    limit(Feature.members, 4, null),
    flag(Feature.autonomous_agents, false),
    flag(Feature.bring_your_own_key, true),
  ],
};

describe('PlanSummaryCard', () => {
  it('names the plan and offers an upgrade that is not available yet', () => {
    render(<PlanSummaryCard subscription={SUBSCRIPTION} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    const upgrade = screen.getByRole('button', { name: 'Upgrade' });
    expect(upgrade).toBeDisabled();
    expect(upgrade).toHaveAccessibleDescription('Billing coming soon');
    expect(screen.getByText(/Limits are not enforced yet/)).toBeInTheDocument();
  });

  it('says when limits block actions', () => {
    render(<PlanSummaryCard subscription={{ ...SUBSCRIPTION, enforced: true }} />);
    expect(screen.getByText(/refused until the plan is upgraded/)).toBeInTheDocument();
  });
});

describe('UsageMeter', () => {
  it('shows the usage of the limit as a meter', () => {
    render(<UsageMeter feature={limit(Feature.active_listings, 12, 50)} />);
    expect(screen.getByText('Active listings')).toBeInTheDocument();
    expect(screen.getByText('12 of 50')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Active listings: 12 of 50' })).toHaveAttribute(
      'aria-valuenow',
      '24',
    );
  });

  it('says when a limit is passed, in words as well as color', () => {
    render(<UsageMeter feature={limit(Feature.channel_connections, 3, 2)} />);
    expect(screen.getByText('3 of 2')).toHaveClass('text-destructive');
    expect(screen.getByText('Over the limit')).toBeInTheDocument();
  });

  it('reads an unlimited feature as used only', () => {
    render(<UsageMeter feature={limit(Feature.members, 4, null)} />);
    expect(screen.getByText('4 used')).toBeInTheDocument();
  });
});

describe('UsageMeterList and PlanFeatureList', () => {
  it('meter the limits and list the flags', () => {
    render(<UsageMeterList features={SUBSCRIPTION.features} />);
    expect(screen.getAllByRole('progressbar')).toHaveLength(3);

    render(<PlanFeatureList features={SUBSCRIPTION.features} />);
    expect(screen.getByText('Autonomous agents')).toBeInTheDocument();
    expect(screen.getByText(/^Not included/)).toBeInTheDocument();
    expect(screen.getByText(/^Included/)).toBeInTheDocument();
  });
});
