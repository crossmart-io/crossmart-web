import { ArrowDownRight, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChangeDirection, type PeriodChange } from '../sales-format';

const CHANGE_STYLES: Record<ChangeDirection, { icon: typeof ArrowUpRight; className: string }> = {
  [ChangeDirection.Up]: { icon: ArrowUpRight, className: 'text-success' },
  [ChangeDirection.Down]: { icon: ArrowDownRight, className: 'text-destructive' },
  [ChangeDirection.Flat]: { icon: ArrowRight, className: 'text-muted-foreground' },
  [ChangeDirection.New]: { icon: Sparkles, className: 'text-muted-foreground' },
};

function changeText({ direction, percent }: PeriodChange): string {
  if (direction === ChangeDirection.New) return 'New';
  if (direction === ChangeDirection.Flat) return 'No change';
  return `${direction === ChangeDirection.Up ? '+' : '−'}${percent}%`;
}

/** A change against the previous period: an icon and a signed percent, never color alone. */
export function ChangeBadge({ change, comparedTo }: { change: PeriodChange; comparedTo: string }) {
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
