import { ChevronDown, PencilLine } from 'lucide-react';
import { useId } from 'react';
import { ListingDisplayState, PriceSource } from '@/api/schema';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { needsReconnect } from '@/features/channels/connection-status';
import { formatMoney, formatPriceRange, pluralize } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ChannelItemAction, channelItemAction } from '../channel-item-action';
import { channelPriceRange } from '../channel-price-range';
import type { ProductChannelRef } from '../hooks/useProductChannels';
import { listingFixOf } from '../listing-fix';
import { hasListingReason } from '../listing-states';
import { CHANNEL_CARD_COPY, CHANNEL_CARD_VARIANT_LIMIT } from '../listings.constants';
import type { ChannelVariant, ProductChannel } from '../listings.types';
import { AddToStoreButton } from './AddToStoreButton';
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

interface ItemActionProps extends Omit<ProductChannelItemProps, 'workspaceId' | 'productId'> {
  listingRef: ProductChannelRef;
}

/** The card's one action: add, fix, try again, or edit the listing. */
function ItemAction({ listingRef, channel, canEdit, onOpen }: ItemActionProps) {
  const fix = listingFixOf({
    displayState: channel.displayState,
    displayRequirement: channel.displayRequirement,
    missingRequirement: channel.listing?.missingRequirement,
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
