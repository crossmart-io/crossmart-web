import { Share2 } from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/config/routes';
import { useProductChannels } from '../hooks/useProductChannels';
import type { OverrideProduct } from './ChannelOverrideSheet';
import { ProductChannelItem } from './ProductChannelItem';

interface ProductChannelsCardProps {
  workspaceId: string;
  product: OverrideProduct;
  canEdit: boolean;
}

function NoChannels() {
  return (
    <div className="flex items-start gap-3 text-sm">
      <Share2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <p className="text-muted-foreground">
        No channel is connected yet.{' '}
        <Link to={ROUTES.channels} className="font-medium text-foreground underline">
          Connect a channel
        </Link>{' '}
        to publish this product there.
      </p>
    </div>
  );
}

/** Where the product is listed, at which price, and what each channel shows differently. */
export function ProductChannelsCard({ workspaceId, product, canEdit }: ProductChannelsCardProps) {
  const { data: channels, isPending } = useProductChannels(workspaceId, product.id);
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-sm font-semibold">Channels</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending && <Skeleton className="h-24 w-full" />}
        {channels?.length === 0 && <NoChannels />}
        {channels && channels.length > 0 && (
          <ul className="flex flex-col gap-3">
            {channels.map((channel) => (
              <ProductChannelItem
                key={channel.connection.id}
                workspaceId={workspaceId}
                product={product}
                channel={channel}
                canEdit={canEdit}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
