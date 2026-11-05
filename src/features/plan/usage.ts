import { FeatureKind } from '@/api/schema';
import { NEAR_LIMIT_RATIO, PERCENT, UNLIMITED_LABEL } from './plan.constants';
import type { FeatureUsage } from './plan.types';

/** How close a counted feature is to its limit, which sets the meter's color and wording. */
export enum UsageLevel {
  Normal = 'normal',
  NearLimit = 'near_limit',
  AtLimit = 'at_limit',
  OverLimit = 'over_limit',
}

/** Counted features the plan includes, in the API's order: these get meters. */
export function meteredFeatures(features: readonly FeatureUsage[]): FeatureUsage[] {
  return features.filter((feature) => feature.kind === FeatureKind.limit);
}

/** Flags, shown as included or not. */
export function flagFeatures(features: readonly FeatureUsage[]): FeatureUsage[] {
  return features.filter((feature) => feature.kind === FeatureKind.flag);
}

export function usageLevel({ usage, limit }: Pick<FeatureUsage, 'usage' | 'limit'>): UsageLevel {
  if (limit === null || usage === null) return UsageLevel.Normal;
  if (usage > limit) return UsageLevel.OverLimit;
  if (usage === limit) return UsageLevel.AtLimit;
  return usage >= limit * NEAR_LIMIT_RATIO ? UsageLevel.NearLimit : UsageLevel.Normal;
}

/** The share of the limit in use, 0–100; an unlimited feature shows an empty meter. */
export function usagePercent({ usage, limit }: Pick<FeatureUsage, 'usage' | 'limit'>): number {
  if (limit === null || usage === null) return 0;
  if (limit === 0) return usage > 0 ? PERCENT : 0;
  return Math.min(PERCENT, Math.round((usage / limit) * PERCENT));
}

export function formatLimit(limit: number | null): string {
  return limit === null ? UNLIMITED_LABEL : limit.toLocaleString();
}

/** "12 of 50", or "12 used" without a limit. */
export function formatUsage({ usage, limit }: Pick<FeatureUsage, 'usage' | 'limit'>): string {
  const used = (usage ?? 0).toLocaleString();
  return limit === null ? `${used} used` : `${used} of ${formatLimit(limit)}`;
}
