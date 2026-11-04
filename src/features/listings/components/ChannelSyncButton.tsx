import { useChannelListings } from '../hooks/useChannelListings';
import { SyncNowButton } from './SyncNowButton';

interface ChannelSyncButtonProps {
  workspaceId: string;
  connectionId: string;
  disabled?: boolean;
}

/** "Publish" or "Sync now" for a connection, named by whether anything is listed yet. */
export function ChannelSyncButton({ workspaceId, connectionId, disabled }: ChannelSyncButtonProps) {
  const listings = useChannelListings({ workspaceId, connectionId });
  return (
    <SyncNowButton
      workspaceId={workspaceId}
      connectionId={connectionId}
      hasListings={listings.listings.length > 0}
      disabled={disabled}
    />
  );
}
