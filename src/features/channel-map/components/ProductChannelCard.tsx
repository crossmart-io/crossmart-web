import { Package, Sparkles, Tag } from 'lucide-react';
import { ListingDisplayState } from '@/api/schema';
import { ListingStateBadge, LISTING_STATE_PRESENTATION, StoreName } from '@/features/listings';
import { channelPriceRange } from '@/features/listings/channel-price-range';
import { hasListingReason } from '@/features/listings/listing-states';
import type { ProductChannel } from '@/features/listings/listings.types';
import { formatPriceRange } from '@/lib/format';
import { cn } from '@/lib/utils';
import { CHANNEL_MAP_COPY } from '../channel-map.constants';
import type { ProductChannelNodeData } from '../channel-map.types';
import { channelStock, hasPriceOverride, overrideSummary } from '../channel-summary';
import { LastSynced } from './LastSynced';

/** The store's price (or range) with a mark when it is set for the store, and its stock. */
function PriceAndStock({ channel }: { channel: ProductChannel }) {
  const range = channelPriceRange(channel.variants);
  const stock = channelStock(channel.variants);
  const custom = hasPriceOverride(channel.variants) || overrideSummary(channel.override).length > 0;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      {range && (
        <span className="font-medium tabular-nums">
          {formatPriceRange(range, channel.connection.currencyCode)}
        </span>
      )}
      <span className="flex items-center gap-1 text-muted-foreground">
        <Package className="size-3" aria-hidden="true" />
        {stock === null ? CHANNEL_MAP_COPY.stockUntracked : CHANNEL_MAP_COPY.stock(stock)}
      </span>
      {custom && (
        <span className="flex items-center gap-1 text-muted-foreground">
          <Tag className="size-3" aria-hidden="true" />
          {CHANNEL_MAP_COPY.overridden}
        </span>
      )}
    </div>
  );
}

/** When the listing last synced, and whether AI suggestions wait for it. */
function SyncLine({ channel, suggestionCount }: Omit<ProductChannelNodeData, 'onOpen'>) {
  const syncedAt = channel.listing?.lastSyncedAt;
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
      <LastSynced value={syncedAt} />
      {suggestionCount > 0 && (
        <span className="flex items-center gap-1 font-medium text-foreground">
          <Sparkles className="size-3" aria-hidden="true" />
          {CHANNEL_MAP_COPY.suggestions(suggestionCount)}
        </span>
      )}
    </div>
  );
}

/**
 * One store on the product's map, as one button: the store, the product's state there in words
 * and an icon, why it failed, its price and stock, and when it last synced. Opens the details.
 */
export function ProductChannelCard({ channel, suggestionCount, onOpen }: ProductChannelNodeData) {
  const reason = hasListingReason(channel.displayState) ? channel.displayReason : null;
  const { label } = LISTING_STATE_PRESENTATION[channel.displayState];
  return (
    <button
      type="button"
      onClick={() => onOpen(channel.connection.id)}
      aria-label={CHANNEL_MAP_COPY.openDetails(channel.connection.displayName, label)}
      data-state={channel.displayState}
      className="flex w-full flex-col gap-2 rounded-xl border bg-card p-3 text-left text-card-foreground shadow-sm transition-colors hover:border-ring/60 hover:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className="flex w-full items-center justify-between gap-2 text-sm">
        <StoreName connection={channel.connection} />
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
        >
          {reason}
        </p>
      )}
      <PriceAndStock channel={channel} />
      <SyncLine channel={channel} suggestionCount={suggestionCount} />
    </button>
  );
}
