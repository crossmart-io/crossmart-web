import { Share2 } from 'lucide-react';
import { useCallback } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { PublishRequirement } from '@/api/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTE_QUERY, ROUTES } from '@/config/routes';
import { useChannelConnections } from '@/features/channels/hooks/useChannelConnections';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
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

/** What each store's setup still lacks, by store, so a product's fix can point there. */
function useStoreMissing(
  workspaceId: string,
): ReadonlyMap<string, readonly PublishRequirement[]> | undefined {
  const { data } = useChannelConnections(workspaceId);
  if (!data) return undefined;
  return new Map(data.map((connection) => [connection.id, connection.publishReadiness.missing]));
}

/** The store whose overrides panel a "fix" link asked to open, and forgetting it once closed. */
function useOverrideRequest() {
  const [searchParams] = useSearchParams();
  const update = useSearchParamsUpdater();
  const clear = useCallback(
    () => update((params) => params.delete(ROUTE_QUERY.overrideStore)),
    [update],
  );
  return { connectionId: searchParams.get(ROUTE_QUERY.overrideStore), clear };
}

/** Where the product is listed, at which price, and what each channel shows differently. */
export function ProductChannelsCard({ workspaceId, product, canEdit }: ProductChannelsCardProps) {
  const { data: channels, isPending } = useProductChannels(workspaceId, product.id);
  const storeMissing = useStoreMissing(workspaceId);
  const overrideRequest = useOverrideRequest();
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
                storeMissing={storeMissing?.get(channel.connection.id)}
                openOverride={overrideRequest.connectionId === channel.connection.id}
                onOverrideClosed={overrideRequest.clear}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
