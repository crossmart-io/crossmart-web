import { Clock } from 'lucide-react';
import { RelativeTime } from '@/components/time/RelativeTime';
import { CHANNEL_MAP_COPY } from '../channel-map.constants';

/** "Synced 5 minutes ago", or that it has not synced yet. */
export function LastSynced({ value }: { value: string | null | undefined }) {
  return (
    <span className="flex items-center gap-1 text-xs whitespace-nowrap text-muted-foreground">
      <Clock className="size-3" aria-hidden="true" />
      {value ? (
        <>
          {CHANNEL_MAP_COPY.lastSync} <RelativeTime value={value} />
        </>
      ) : (
        CHANNEL_MAP_COPY.neverSynced
      )}
    </span>
  );
}
