import { ExternalLink, PencilLine, Plus, X } from 'lucide-react';
import { useId, useState } from 'react';
import { Link } from 'react-router';
import { PriceSource, type PublishRequirement } from '@/api/schema';
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
  STORE_NOT_CONNECTED_COPY,
} from '../listings.constants';
import type { ChannelVariant, ProductChannel } from '../listings.types';
import { ChannelOverrideSheet, type OverrideProduct } from './ChannelOverrideSheet';
import { ListingIssue } from './ListingIssue';
import { ListingStateBadge } from './ListingStateBadge';
import { listingFixOf } from '../listing-fix';
import { PriceExplanation } from './PriceExplanation';
import { ChannelLogoSize, channelInfoFor } from '@/features/channels/channels.constants';
import { ChannelLogo } from '@/features/channels/components/ChannelLogo';
import { needsReconnect } from '@/features/channels/connection-status';

interface ProductChannelItemProps {
  workspaceId: string;
  product: OverrideProduct;
  channel: ProductChannel;
  canEdit: boolean;
  /** What the store's setup lacks, so a fix can point there; unknown while it loads. */
  storeMissing?: readonly PublishRequirement[];
  /** Opens the overrides panel at once, as a "fix" link from elsewhere asks. */
  openOverride?: boolean;
  /** Called when that panel closes, so the link's request is not repeated. */
  onOverrideClosed?: () => void;
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

/** The first variants' prices and stock on the store, and how many more there are. */
function VariantPrices({ channel }: { channel: ProductChannel }) {
  const { connection, variants } = channel;
  const shown = variants.slice(0, CHANNEL_CARD_VARIANT_LIMIT);
  const hidden = variants.length - shown.length;
  return (
    <>
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
    </>
  );
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

/** Why the store cannot take products now, with a link to the page where it is reconnected. */
function NotConnectedHint({ id, connectionId }: { id: string; connectionId: string }) {
  return (
    <p id={id} className="text-xs text-muted-foreground">
      {STORE_NOT_CONNECTED_COPY.reason}{' '}
      <Link
        to={toChannelConnectionRoute(connectionId)}
        className="font-medium text-foreground underline"
      >
        {STORE_NOT_CONNECTED_COPY.action}
      </Link>
    </p>
  );
}

/**
 * Adding at once, as most products need, or with this store's changes first. Both wait while
 * the store needs reconnecting: nothing could be published there.
 */
function AddToStoreButtons({ workspaceId, productId, channel, onOpen }: ChannelItemActionsProps) {
  const add = useAddToStore({ workspaceId, productId, connectionId: channel.connection.id });
  const hintId = useId();
  const blocked = needsReconnect(channel.connection.status);
  return (
    <div className="flex flex-wrap gap-2">
      {blocked && <NotConnectedHint id={hintId} connectionId={channel.connection.id} />}
      <Button
        type="button"
        size="sm"
        disabled={add.isPending || blocked}
        aria-describedby={blocked ? hintId : undefined}
        onClick={() => add.mutate()}
      >
        {add.isPending ? <Spinner data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
        Add to store
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={add.isPending || blocked}
        aria-describedby={blocked ? hintId : undefined}
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
        <ListingStateBadge state={channel.displayState} />
      </div>
    </div>
  );
}

/** Why the product cannot be published here, how to fix it, and trying again after a failure. */
function ItemIssue({
  workspaceId,
  productId,
  channel,
  canEdit,
  storeMissing,
  onOpenOverride,
}: Pick<ProductChannelItemProps, 'workspaceId' | 'channel' | 'canEdit' | 'storeMissing'> & {
  productId: string;
  onOpenOverride: () => void;
}) {
  const fix = listingFixOf({
    displayState: channel.displayState,
    missingRequirement: channel.listing?.missingRequirement,
    storeMissing,
  });
  return (
    <ListingIssue
      state={channel.displayState}
      reason={channel.displayReason}
      fix={fix}
      listing={{ workspaceId, productId, connectionId: channel.connection.id }}
      canEdit={canEdit}
      canRetry={!needsReconnect(channel.connection.status)}
      onOpenOverride={onOpenOverride}
    />
  );
}

export function ProductChannelItem({
  workspaceId,
  product,
  channel,
  canEdit,
  storeMissing,
  openOverride = false,
  onOverrideClosed,
}: ProductChannelItemProps) {
  const [sheetMode, setSheetMode] = useState<OverrideSheetMode | null>(
    openOverride && canEdit && channel.selected ? OverrideSheetMode.Edit : null,
  );
  const closeSheet = () => {
    setSheetMode(null);
    onOverrideClosed?.();
  };
  return (
    <li className="flex flex-col gap-3 rounded-lg border p-3">
      <ItemHeader channel={channel} />
      <ItemIssue
        workspaceId={workspaceId}
        productId={product.id}
        channel={channel}
        canEdit={canEdit}
        storeMissing={storeMissing}
        onOpenOverride={() => setSheetMode(OverrideSheetMode.Edit)}
      />
      <VariantPrices channel={channel} />
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
          onOpenChange={(open) => !open && closeSheet()}
        />
      )}
    </li>
  );
}
