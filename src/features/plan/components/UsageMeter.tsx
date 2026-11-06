import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { FEATURE_LABELS } from '../plan.constants';
import type { FeatureUsage } from '../plan.types';
import { formatUsage, UsageLevel, usageLevel, usagePercent } from '../usage';

/** Meter fills by level: reserved colors, always next to the numbers they stand for. */
const METER_FILLS: Record<UsageLevel, string> = {
  [UsageLevel.Normal]: '',
  [UsageLevel.NearLimit]: '*:data-[slot=progress-indicator]:bg-warning',
  [UsageLevel.AtLimit]: '*:data-[slot=progress-indicator]:bg-warning',
  [UsageLevel.OverLimit]: '*:data-[slot=progress-indicator]:bg-destructive',
};

const LEVEL_NOTES: Partial<Record<UsageLevel, string>> = {
  [UsageLevel.AtLimit]: 'Limit reached',
  [UsageLevel.OverLimit]: 'Over the limit',
};

/** One counted feature: what it is, how much is used of how much, and a meter. */
export function UsageMeter({ feature }: { feature: FeatureUsage }) {
  const { label, description } = FEATURE_LABELS[feature.feature];
  const level = usageLevel(feature);
  const note = LEVEL_NOTES[level];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-medium">{label}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
        <span
          className={cn(
            'shrink-0 text-sm tabular-nums',
            level === UsageLevel.OverLimit && 'text-destructive',
          )}
        >
          {formatUsage(feature)}
        </span>
      </div>
      <Progress
        value={usagePercent(feature)}
        aria-label={`${label}: ${formatUsage(feature)}`}
        className={METER_FILLS[level]}
      />
      {note && <span className="text-xs text-muted-foreground">{note}</span>}
    </div>
  );
}
