import { ChevronDown, PencilLine, Plus } from 'lucide-react';
import { useId } from 'react';
import { Link } from 'react-router';
import { ListingDisplayState, PriceSource, type PublishRequirement } from '@/api/schema';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Spinner } from '@/components/ui/spinner';
import { toChannelConnectionRoute } from '@/config/routes';
import { needsReconnect } from '@/features/channels/connection-status';
import { formatMoney, formatPriceRange, pluralize } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ChannelItemAction, channelItemAction } from '../channel-item-action';
import { channelPriceRange } from '../channel-price-range';
import { type ProductChannelRef, useAddToStore } from '../hooks/useProductChannels';
import { listingFixOf } from '../listing-fix';
import { hasListingReason } from '../listing-states';
import {
  CHANNEL_CARD_COPY,
  CHANNEL_CARD_VARIANT_LIMIT,
  STORE_NOT_CONNECTED_COPY,
} from '../listings.constants';
import type { ChannelVariant, ProductChannel } from '../listings.types';
import { ListingFixAction } from './ListingFixAction';
import { ListingStateBadge } from './ListingStateBadge';
import { PriceExplanation } from './PriceExplanation';
import { RetryListingButton } from './RetryListingButton';
import { StoreName } from './StoreName';

interface ProductChannelItemProps {
  workspaceId: string;
  productId: string;
  channel: ProductChannel;
  canEdit: boolean;
  /** What the store's setup lacks, so a fix can point there; unknown while it loads. */
  storeMissing?: readonly PublishRequirement[];
  /** Opens this store's listing editor. */
  onOpen: () => void;
}

function VariantPrice({ variant, currency }: { variant: ChannelVariant; currency: string }) {
  return (
    <li className="flex flex-col gap-0.5">
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="truncate text-muted-foreground">{variant.title}</span>
        <span className="font-medium tabular-nums">
          {formatMoney(variant.price.price, currency)}
          {variant.price.source === PriceSource.override && (
            <span className="sr-only"> ({CHANNEL_CARD_COPY.setForStore})</span>
          )}
        </span>
      </div>
      <PriceExplanation price={variant.price} onDemand />
    </li>
  );
}

/** The store's prices per variant, hidden until asked for: the first few, then how many more. */
function VariantDetails({ channel, contentId }: { channel: ProductChannel; contentId: string }) {
  const { connection, variants } = channel;
  const shown = variants.slice(0, CHANNEL_CARD_VARIANT_LIMIT);
  const hidden = variants.length - shown.length;
  return (
    <CollapsibleContent id={contentId} className="flex flex-col gap-2 border-t pt-2">
      <ul className="flex flex-col gap-2">
        {shown.map((variant) => (
          <VariantPrice
            key={variant.variantId}
            variant={variant}
            currency={connection.currencyCode}
          />
        ))}
      </ul>
      {hidden > 0 && (
        <p className="text-xs text-muted-foreground">and {pluralize(hidden, 'more variant')}</p>
      )}
    </CollapsibleContent>
  );
}

/** The store's price, or its range across variants, with the toggle for each variant's. */
function PriceSummary({ channel, contentId }: { channel: ProductChannel; contentId: string }) {
  const range = channelPriceRange(channel.variants);
  if (!range) return <span />;
  return (
    <div className="flex min-w-0 items-center gap-2 text-sm">
      <span className="font-medium tabular-nums">
        {formatPriceRange(range, channel.connection.currencyCode)}
      </span>
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="link"
          size="xs"
          aria-controls={contentId}
          className="group h-auto p-0 text-xs text-muted-foreground"
        >
          {CHANNEL_CARD_COPY.details}
          <ChevronDown
            data-icon="inline-end"
            className="transition-transform group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </Button>
      </CollapsibleTrigger>
    </div>
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

/** Adds the product in one click; blocked while the store needs reconnecting, and says why. */
function AddToStoreButton({
  listingRef,
  channel,
}: {
  listingRef: ProductChannelRef;
  channel: ProductChannel;
}) {
  const add = useAddToStore(listingRef);
  const hintId = useId();
  const blocked = needsReconnect(channel.connection.status);
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="xs"
        disabled={add.isPending || blocked}
        aria-describedby={blocked ? hintId : undefined}
        onClick={() => add.mutate()}
      >
        {add.isPending ? <Spinner data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
        {CHANNEL_CARD_COPY.add}
      </Button>
      {blocked && <NotConnectedHint id={hintId} connectionId={channel.connection.id} />}
    </>
  );
}

interface ItemActionProps extends Omit<ProductChannelItemProps, 'workspaceId' | 'productId'> {
  listingRef: ProductChannelRef;
}

/** The card's one action: add, fix, try again, or edit the listing. */
function ItemAction({ listingRef, channel, canEdit, storeMissing, onOpen }: ItemActionProps) {
  const fix = listingFixOf({
    displayState: channel.displayState,
    missingRequirement: channel.listing?.missingRequirement,
    storeMissing,
  });
  const action = channelItemAction({
    canEdit,
    selected: channel.selected,
    displayState: channel.displayState,
    fix,
    canRetry: !needsReconnect(channel.connection.status),
  });
  switch (action) {
    case ChannelItemAction.Add:
      return <AddToStoreButton listingRef={listingRef} channel={channel} />;
    case ChannelItemAction.Fix:
      return fix && <ListingFixAction fix={fix} listing={listingRef} onOpenOverride={onOpen} />;
    case ChannelItemAction.Retry:
      return <RetryListingButton listing={listingRef} />;
    case ChannelItemAction.Edit:
      return (
        <Button type="button" variant="outline" size="xs" onClick={onOpen}>
          <PencilLine data-icon="inline-start" />
          {CHANNEL_CARD_COPY.edit}
        </Button>
      );
    case ChannelItemAction.None:
      return null;
  }
}

/**
 * One store on the product's page, compact: the store, the product's state and price there, and
 * the one thing to do next. The store's name opens the listing editor; Details lists each
 * variant's price, and how it was worked out on request.
 */
export function ProductChannelItem({
  workspaceId,
  productId,
  channel,
  ...props
}: ProductChannelItemProps) {
  const listingRef = { workspaceId, productId, connectionId: channel.connection.id };
  const detailsId = useId();
  const reason = hasListingReason(channel.displayState) ? channel.displayReason : null;
  return (
    <li className="rounded-lg border p-2.5">
      <Collapsible className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={props.onOpen}
            aria-label={`${CHANNEL_CARD_COPY.openListing} ${channel.connection.displayName}`}
            className="min-w-0 rounded-sm text-left text-sm hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <StoreName connection={channel.connection} />
          </button>
          <ListingStateBadge state={channel.displayState} />
        </div>
        {reason && (
          <p
            className={cn(
              'line-clamp-2 text-xs break-words',
              channel.displayState === ListingDisplayState.failed
                ? 'text-destructive'
                : 'text-warning',
            )}
            title={reason}
          >
            {reason}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PriceSummary channel={channel} contentId={detailsId} />
          <ItemAction listingRef={listingRef} channel={channel} {...props} />
        </div>
        <VariantDetails channel={channel} contentId={detailsId} />
      </Collapsible>
    </li>
  );
}
