import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useRequestSync } from '../hooks/useChannelListings';

interface SyncNowButtonProps {
  workspaceId: string;
  connectionId: string;
  /** "Publish" before anything is listed, "Sync now" after. */
  hasListings: boolean;
  disabled?: boolean;
}

/**
 * Sends every product of the store again, and delists what it should no longer have. Changes
 * apply at once, so this is for recovery: after an outage or a change made on the channel.
 */
export function SyncNowButton({
  workspaceId,
  connectionId,
  hasListings,
  disabled,
}: SyncNowButtonProps) {
  const sync = useRequestSync({ workspaceId, connectionId });
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled || sync.isPending}
      onClick={() => sync.mutate()}
    >
      {sync.isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <RefreshCw data-icon="inline-start" />
      )}
      {hasListings ? 'Resync everything' : 'Publish the store’s products'}
    </Button>
  );
}
