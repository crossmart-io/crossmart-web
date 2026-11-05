import { ExternalLink, PencilLine, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { PriceSource } from '@/api/schema';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toChannelConnectionRoute } from '@/config/routes';
import { formatMoney, pluralize } from '@/lib/format';
import { useAddToStore, useRemoveFromStore } from '../hooks/useProductChannels';
import {
  CHANNEL_CARD_VARIANT_LIMIT,
  LISTING_SOURCE_LABELS,
  OverrideSheetMode,
} from '../listings.constants';
import type { ChannelVariant, ProductChannel } from '../listings.types';
import { ChannelOverrideSheet, type OverrideProduct } from './ChannelOverrideSheet';
import { ListingStatusBadge } from './ListingStatusBadge';
import { PriceExplanation } from './PriceExplanation';
import { ChannelLogoSize, channelInfoFor } from '@/features/channels/channels.constants';
import { ChannelLogo } from '@/features/channels/components/ChannelLogo';

interface ProductChannelItemProps {
  workspaceId: string;
  product: OverrideProduct;
  channel: ProductChannel;
  canEdit: boolean;
}

function VariantPrice({
  variant,
  currency,
  showTitle,
}: {
  variant: ChannelVariant;
  currency: string;
  showTitle: boolean;
}) {
  return (
    <li className="flex flex-col gap-0.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate text-muted-foreground">
          {showTitle ? variant.title : 'Price'}
        </span>
        <span className="font-medium tabular-nums">
          {formatMoney(variant.price.price, currency)}
          {variant.price.source === PriceSource.override && (
            <span className="sr-only"> (set for this store)</span>
          )}
        </span>
      </div>
      <PriceExplanation price={variant.price} />
      {variant.quantity !== null && (
        <span className="text-xs text-muted-foreground">
          Shows {pluralize(variant.quantity, 'unit')} in stock
        </span>
      )}
    </li>
  );
}

function ListingState({ channel }: { channel: ProductChannel }) {
  if (!channel.selected) return <Badge variant="outline">Not in this store</Badge>;
  if (channel.listing) return <ListingStatusBadge status={channel.listing.status} />;
  return <Badge variant="outline">Waiting to publish</Badge>;
}

function StoreLogo({ channel }: { channel: ProductChannel['connection']['channel'] }) {
  const info = channelInfoFor(channel);
  return info ? <ChannelLogo logo={info.logo} size={ChannelLogoSize.Small} /> : null;
}

interface ChannelItemActionsProps {
  workspaceId: string;
  productId: string;
  channel: ProductChannel;
  canEdit: boolean;
  onOpen: (mode: OverrideSheetMode) => void;
}

function RemoveFromStoreButton({
  workspaceId,
  productId,
  channel,
}: Omit<ChannelItemActionsProps, 'canEdit' | 'onOpen'>) {
  const remove = useRemoveFromStore({
    workspaceId,
    productId,
    connectionId: channel.connection.id,
  });
  const store = channel.connection.displayName;
  return (
    <ConfirmDialog
      trigger={
        <Button type="button" variant="ghost" size="sm">
          <X data-icon="inline-start" />
          Remove
        </Button>
      }
      title={`Remove from ${store}?`}
      description={`It is taken off ${store} now. The product stays in your catalog and in your other stores.`}
      confirmLabel="Remove"
      onConfirm={() => remove.mutateAsync()}
    />
  );
}

/** Adding at once, as most products need, or with this store's changes first. */
function AddToStoreButtons({ workspaceId, productId, channel, onOpen }: ChannelItemActionsProps) {
  const add = useAddToStore({ workspaceId, productId, connectionId: channel.connection.id });
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" size="sm" disabled={add.isPending} onClick={() => add.mutate()}>
        {add.isPending ? <Spinner data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
        Add to store
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={add.isPending}
        onClick={() => onOpen(OverrideSheetMode.Add)}
      >
        <PencilLine data-icon="inline-start" />
        Add with changes…
      </Button>
    </div>
  );
}

/** Adding the product to the store, or, once it is there, overriding, viewing or removing it. */
function ChannelItemActions(props: ChannelItemActionsProps) {
  const { channel, canEdit, onOpen } = props;
  const externalUrl = channel.listing?.externalUrl;
  if (!channel.selected) {
    return canEdit ? <AddToStoreButtons {...props} /> : null;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {canEdit && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onOpen(OverrideSheetMode.Edit)}
        >
          <PencilLine data-icon="inline-start" />
          Override for this store
        </Button>
      )}
      {externalUrl && (
        <Button asChild variant="ghost" size="sm">
          <a href={externalUrl} target="_blank" rel="noreferrer">
            <ExternalLink data-icon="inline-start" />
            View
          </a>
        </Button>
      )}
      {canEdit && <RemoveFromStoreButton {...props} />}
    </div>
  );
}

/** The store with its logo, how the product joined it, and where it stands there. */
function ItemHeader({ channel }: { channel: ProductChannel }) {
  const { connection, listing } = channel;
  return (
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="flex min-w-0 flex-col gap-0.5">
        <Link
          to={toChannelConnectionRoute(connection.id)}
          className="flex min-w-0 items-center gap-2 font-medium hover:underline"
        >
          <StoreLogo channel={connection.channel} />
          <span className="truncate">{connection.displayName}</span>
        </Link>
        {channel.selected && listing && (
          <span className="text-xs text-muted-foreground">
            {LISTING_SOURCE_LABELS[listing.source]}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        {channel.override && (
          <Badge variant="secondary">{channel.selected ? 'Overridden' : 'Saved overrides'}</Badge>
        )}
        <ListingState channel={channel} />
      </div>
    </div>
  );
}

export function ProductChannelItem({
  workspaceId,
  product,
  channel,
  canEdit,
}: ProductChannelItemProps) {
  const [sheetMode, setSheetMode] = useState<OverrideSheetMode | null>(null);
  const { connection, listing, variants } = channel;
  const shown = variants.slice(0, CHANNEL_CARD_VARIANT_LIMIT);
  const hidden = variants.length - shown.length;
  return (
    <li className="flex flex-col gap-3 rounded-lg border p-3">
      <ItemHeader channel={channel} />
      {listing?.lastError && <p className="text-sm text-destructive">{listing.lastError}</p>}
      <ul className="flex flex-col gap-3">
        {shown.map((variant) => (
          <VariantPrice
            key={variant.variantId}
            variant={variant}
            currency={connection.currencyCode}
            showTitle={variants.length > 1}
          />
        ))}
      </ul>
      {hidden > 0 && (
        <p className="text-xs text-muted-foreground">and {pluralize(hidden, 'more variant')}</p>
      )}
      <ChannelItemActions
        workspaceId={workspaceId}
        productId={product.id}
        channel={channel}
        canEdit={canEdit}
        onOpen={setSheetMode}
      />
      {sheetMode && (
        <ChannelOverrideSheet
          workspaceId={workspaceId}
          product={product}
          channel={channel}
          mode={sheetMode}
          open
          onOpenChange={(open) => !open && setSheetMode(null)}
        />
      )}
    </li>
  );
}
