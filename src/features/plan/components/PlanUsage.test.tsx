import { render, screen } from '@testing-library/react';
import { Feature, FeatureKind } from '@/api/schema';
import type { FeatureUsage } from '../plan.types';
import { PlanFeatureList } from './PlanFeatureList';
import { UsageMeter } from './UsageMeter';
import { UsageMeterList } from './UsageMeterList';

function limit(feature: Feature, usage: number, max: number | null): FeatureUsage {
  return { feature, kind: FeatureKind.limit, enabled: true, limit: max, usage };
}

function flag(feature: Feature, enabled: boolean): FeatureUsage {
  return { feature, kind: FeatureKind.flag, enabled, limit: enabled ? null : 0, usage: null };
}

const FEATURES: FeatureUsage[] = [
  limit(Feature.active_listings, 12, 50),
  limit(Feature.channel_connections, 4, 3),
  limit(Feature.members, 4, null),
  flag(Feature.autonomous_agents, false),
  flag(Feature.bring_your_own_key, true),
];

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
    render(<UsageMeterList features={FEATURES} />);
    expect(screen.getAllByRole('progressbar')).toHaveLength(3);

    render(<PlanFeatureList features={FEATURES} />);
    expect(screen.getByText('Autonomous agents')).toBeInTheDocument();
    expect(screen.getByText(/^Not included/)).toBeInTheDocument();
    expect(screen.getByText(/^Included/)).toBeInTheDocument();
  });
});
