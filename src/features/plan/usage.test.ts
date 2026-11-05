import { Feature, FeatureKind } from '@/api/schema';
import {
  flagFeatures,
  formatUsage,
  meteredFeatures,
  UsageLevel,
  usageLevel,
  usagePercent,
} from './usage';

const listings = (usage: number | null, limit: number | null) => ({ usage, limit });

describe('usageLevel', () => {
  it('warns from 80% of the limit, and says when it is reached or passed', () => {
    expect(usageLevel(listings(39, 50))).toBe(UsageLevel.Normal);
    expect(usageLevel(listings(40, 50))).toBe(UsageLevel.NearLimit);
    expect(usageLevel(listings(50, 50))).toBe(UsageLevel.AtLimit);
    expect(usageLevel(listings(51, 50))).toBe(UsageLevel.OverLimit);
    expect(usageLevel(listings(9_999, null))).toBe(UsageLevel.Normal);
  });
});

describe('usagePercent', () => {
  it('fills the meter by share of the limit, never past full', () => {
    expect(usagePercent(listings(25, 50))).toBe(50);
    expect(usagePercent(listings(80, 50))).toBe(100);
    expect(usagePercent(listings(3, null))).toBe(0);
    expect(usagePercent(listings(0, 0))).toBe(0);
    expect(usagePercent(listings(1, 0))).toBe(100);
  });
});

describe('formatUsage', () => {
  it('reads as used of the limit, or used alone when unlimited', () => {
    expect(formatUsage(listings(1200, 10000))).toBe(
      `${(1200).toLocaleString()} of ${(10000).toLocaleString()}`,
    );
    expect(formatUsage(listings(3, null))).toBe('3 used');
  });
});

describe('meteredFeatures and flagFeatures', () => {
  it('split counted features from flags', () => {
    const features = [
      { feature: Feature.workspaces, kind: FeatureKind.limit, enabled: true, limit: 1, usage: 1 },
      {
        feature: Feature.autonomous_agents,
        kind: FeatureKind.flag,
        enabled: false,
        limit: 0,
        usage: null,
      },
    ];
    expect(meteredFeatures(features).map((entry) => entry.feature)).toEqual([Feature.workspaces]);
    expect(flagFeatures(features).map((entry) => entry.feature)).toEqual([
      Feature.autonomous_agents,
    ]);
  });
});
