import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useChannelListings } from '../hooks/useChannelListings';
import { ChannelListingsTable } from './ChannelListingsTable';

interface ChannelListingsCardProps {
  workspaceId: string;
  connectionId: string;
}

/** What is on the channel now: each listing with its status, last error and last sync. */
export function ChannelListingsCard({ workspaceId, connectionId }: ChannelListingsCardProps) {
  const listings = useChannelListings({ workspaceId, connectionId });
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Listings</h2>
        </CardTitle>
        <CardDescription>Publishing runs in the background; refresh to follow it.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChannelListingsTable listings={listings} />
      </CardContent>
    </Card>
  );
}
