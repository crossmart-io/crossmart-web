import { Badge } from '@/components/ui/badge';
import { BELL_COPY } from '../notifications.constants';

/** The count of new notices on the bell. Hidden from screen readers: the bell's label says it. */
export function UnreadBadge({ count }: { count: number }) {
  if (count === 0) return null;
  const shown = count > BELL_COPY.maxCount ? `${BELL_COPY.maxCount}+` : String(count);
  return (
    <Badge
      aria-hidden="true"
      variant="destructive"
      className="pointer-events-none absolute -top-0.5 -right-0.5 h-4 min-w-4 bg-destructive px-1 text-[10px] leading-none text-white dark:bg-destructive"
    >
      {shown}
    </Badge>
  );
}
