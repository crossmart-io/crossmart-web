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

/** Publishes the selected products and syncs the rest of the connection in the background. */
export function SyncNowButton({
  workspaceId,
  connectionId,
  hasListings,
  disabled,
}: SyncNowButtonProps) {
  const sync = useRequestSync({ workspaceId, connectionId });
  return (
    <Button type="button" disabled={disabled || sync.isPending} onClick={() => sync.mutate()}>
      {sync.isPending ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <RefreshCw data-icon="inline-start" />
      )}
      {hasListings ? 'Sync now' : 'Publish selected products'}
    </Button>
  );
}
