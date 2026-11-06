import { Share2 } from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTE_QUERY, ROUTES } from '@/config/routes';
import { useProductChannels } from '../hooks/useProductChannels';
import { useEditorSearchParam } from '../hooks/useEditorSearchParam';
import { useStoreMissing } from '../hooks/useStoreMissing';
import { OverrideSheetMode } from '../listings.constants';
import type { ProductChannel } from '../listings.types';
import { ListingEditorSheet } from './ListingEditorSheet';
import { ProductChannelItem } from './ProductChannelItem';

interface ProductChannelsCardProps {
  workspaceId: string;
  productId: string;
  /** The workspace's currency, which the product's own prices are in. */
  catalogCurrency: string;
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

/** The editor opens on a store the product is in to edit it, and on one it is not in to add it. */
function modeFor(channel: ProductChannel | undefined): OverrideSheetMode {
  return channel && !channel.selected ? OverrideSheetMode.Add : OverrideSheetMode.Edit;
}

/**
 * Where the product is listed: a compact card per store with its state, price and next action.
 * A store opens the listing editor in a side panel, the same one the store's listings open,
 * named in the URL (`?override=<store>`) so fix links and shared links open it too.
 */
export function ProductChannelsCard({
  workspaceId,
  productId,
  catalogCurrency,
  canEdit,
}: ProductChannelsCardProps) {
  const { data: channels, isPending } = useProductChannels(workspaceId, productId);
  const storeMissing = useStoreMissing(workspaceId);
  const editor = useEditorSearchParam(ROUTE_QUERY.overrideStore);
  const openChannel = channels?.find(({ connection }) => connection.id === editor.openId);
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
          <ul className="flex flex-col gap-2">
            {channels.map((channel) => (
              <ProductChannelItem
                key={channel.connection.id}
                workspaceId={workspaceId}
                productId={productId}
                channel={channel}
                canEdit={canEdit}
                storeMissing={storeMissing?.get(channel.connection.id)}
                onOpen={() => editor.open(channel.connection.id)}
              />
            ))}
          </ul>
        )}
        {editor.openId && (
          <ListingEditorSheet
            listingRef={{ workspaceId, productId, connectionId: editor.openId }}
            catalogCurrency={catalogCurrency}
            canEdit={canEdit}
            mode={modeFor(openChannel)}
            onClose={editor.close}
          />
        )}
      </CardContent>
    </Card>
  );
}
