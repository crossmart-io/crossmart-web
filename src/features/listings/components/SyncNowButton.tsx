import { RefreshCw, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useRequestSync } from '../hooks/useChannelListings';
import { describeSyncProgress, useSyncProgress } from '../hooks/useSyncProgress';
import { SYNC_COPY } from '../listings.constants';

interface SyncNowButtonProps {
  workspaceId: string;
  connectionId: string;
  /** The channel's name, such as eBay, so the button says where products go. */
  channelName: string;
  /** "Send again" once anything is listed, "Publish" before. */
  hasListings: boolean;
  disabled?: boolean;
}

/**
 * Sends every product of the store again, and delists what it should no longer have. Changes
 * apply at once, so this is for recovery: after an outage or a change made on the channel. Its
 * progress shows under it, and a toast sums it up once nothing is left to send.
 */
export function SyncNowButton({
  workspaceId,
  connectionId,
  channelName,
  hasListings,
  disabled,
}: SyncNowButtonProps) {
  const ref = { workspaceId, connectionId };
  const sync = useRequestSync(ref);
  const progress = useSyncProgress(ref, channelName);
  const busy = sync.isPending || progress.watching;
  const Icon = hasListings ? RefreshCw : Send;
  return (
    <div className="flex flex-col items-start gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || busy}
        onClick={() => sync.mutate(undefined, { onSuccess: progress.start })}
      >
        {busy ? <Spinner data-icon="inline-start" /> : <Icon data-icon="inline-start" />}
        {hasListings ? SYNC_COPY.resend(channelName) : SYNC_COPY.firstPublish(channelName)}
      </Button>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {progress.watching
          ? `${SYNC_COPY.inProgress} ${progress.progress ? describeSyncProgress(progress.progress) : ''}`
          : SYNC_COPY.description(channelName)}
      </p>
    </div>
  );
}
