import type { ChannelType } from '@/api/schema';
import { channelInfoFor } from '@/features/channels/channels.constants';
import { useChannelListings } from '../hooks/useChannelListings';
import { SYNC_COPY } from '../listings.constants';
import { SyncNowButton } from './SyncNowButton';

interface ChannelSyncButtonProps {
  workspaceId: string;
  connectionId: string;
  channel: ChannelType;
  disabled?: boolean;
}

/** "Publish all products" or "Send all products again" for a store, named by its channel. */
export function ChannelSyncButton({
  workspaceId,
  connectionId,
  channel,
  disabled,
}: ChannelSyncButtonProps) {
  const listings = useChannelListings({ workspaceId, connectionId });
  return (
    <SyncNowButton
      workspaceId={workspaceId}
      connectionId={connectionId}
      channelName={channelInfoFor(channel)?.name ?? SYNC_COPY.fallbackChannel}
      hasListings={listings.listings.length > 0}
      disabled={disabled}
    />
  );
}
