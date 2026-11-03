import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useChannelListings } from '../hooks/useChannelListings';
import { ChannelListingsTable } from './ChannelListingsTable';
import { SyncNowButton } from './SyncNowButton';

interface ChannelListingsCardProps {
  workspaceId: string;
  connectionId: string;
  canManage: boolean;
  isConnected: boolean;
}

/** Listings with their status, last error and last sync, and the action that syncs them. */
export function ChannelListingsCard({
  workspaceId,
  connectionId,
  canManage,
  isConnected,
}: ChannelListingsCardProps) {
  const listings = useChannelListings({ workspaceId, connectionId });
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Listings</h2>
        </CardTitle>
        <CardDescription>Publishing runs in the background; refresh to follow it.</CardDescription>
        {canManage && (
          <CardAction>
            <SyncNowButton
              workspaceId={workspaceId}
              connectionId={connectionId}
              hasListings={listings.listings.length > 0}
              disabled={!isConnected}
            />
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <ChannelListingsTable listings={listings} />
      </CardContent>
    </Card>
  );
}
