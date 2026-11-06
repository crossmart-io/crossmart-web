import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChangeDirection, type PeriodChange } from '../sales-format';
import { CHANGE_COPY } from '../sales.constants';

type MeasuredDirection = Exclude<ChangeDirection, ChangeDirection.New>;

const CHANGE_STYLES: Record<MeasuredDirection, { icon: typeof ArrowUpRight; className: string }> = {
  [ChangeDirection.Up]: { icon: ArrowUpRight, className: 'text-success' },
  [ChangeDirection.Down]: { icon: ArrowDownRight, className: 'text-destructive' },
  [ChangeDirection.Flat]: { icon: ArrowRight, className: 'text-muted-foreground' },
};

function changeText({ direction, percent }: PeriodChange): string {
  if (direction === ChangeDirection.Flat) return CHANGE_COPY.flat;
  return `${direction === ChangeDirection.Up ? '+' : '−'}${percent}%`;
}

/**
 * A change against the previous period: an icon and a signed percent, never color alone. With
 * nothing to compare against, it says so instead.
 */
export function ChangeBadge({ change, comparedTo }: { change: PeriodChange; comparedTo: string }) {
  if (change.direction === ChangeDirection.New) {
    return (
      <p className="text-xs text-muted-foreground">{CHANGE_COPY.noPreviousSales(comparedTo)}</p>
    );
  }
  const { icon: Icon, className } = CHANGE_STYLES[change.direction];
  return (
    <p className="flex items-center gap-1 text-xs text-muted-foreground">
      <span className={cn('flex items-center gap-0.5 font-medium', className)}>
        <Icon className="size-3.5" aria-hidden="true" />
        {changeText(change)}
      </span>
      vs {comparedTo}
    </p>
  );
}
