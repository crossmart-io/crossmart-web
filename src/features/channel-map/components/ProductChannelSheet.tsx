import { ExternalLink, PencilLine } from 'lucide-react';
import type { ReactNode } from 'react';
import { RelativeTime } from '@/components/time/RelativeTime';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { needsReconnect } from '@/features/channels/connection-status';
import {
  AddToStoreButton,
  ListingIssue,
  ListingStateBadge,
  listingFixOf,
  StoreName,
} from '@/features/listings';
import { channelPriceRange } from '@/features/listings/channel-price-range';
import type { ProductChannelRef } from '@/features/listings/hooks/useProductChannels';
import type { ProductChannel } from '@/features/listings/listings.types';
import type { Suggestion } from '@/features/suggestions/suggestions.types';
import { ReviewableSuggestions } from '@/features/suggestions';
import { formatPriceRange } from '@/lib/format';
import { CHANNEL_MAP_COPY, CHANNEL_PANEL_COPY } from '../channel-map.constants';
import { channelStock, overrideSummary } from '../channel-summary';

export interface ProductChannelSheetProps {
  listingRef: ProductChannelRef;
  channel: ProductChannel;
  suggestions: readonly Suggestion[];
  canEdit: boolean;
  /** Opens the store's listing editor, where its overrides are changed. */
  onEditOverrides: () => void;
  onClose: () => void;
}

function Detail({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <dt className="shrink-0 text-muted-foreground">{term}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

/** The product on the store, figure by figure. */
function ChannelDetails({ channel }: { channel: ProductChannel }) {
  const range = channelPriceRange(channel.variants);
  const stock = channelStock(channel.variants);
  const overrides = overrideSummary(channel.override);
  const syncedAt = channel.listing?.lastSyncedAt;
  return (
    <dl className="flex flex-col divide-y">
      <Detail term={CHANNEL_PANEL_COPY.status}>
        <ListingStateBadge state={channel.displayState} />
      </Detail>
      <Detail term={CHANNEL_PANEL_COPY.lastSync}>
        {syncedAt ? <RelativeTime value={syncedAt} /> : CHANNEL_MAP_COPY.neverSynced}
      </Detail>
      {range && (
        <Detail term={CHANNEL_PANEL_COPY.price}>
          <span className="tabular-nums">
            {formatPriceRange(range, channel.connection.currencyCode)}
          </span>
        </Detail>
      )}
      <Detail term={CHANNEL_PANEL_COPY.stock}>
        {stock === null ? CHANNEL_MAP_COPY.stockUntracked : stock.toLocaleString()}
      </Detail>
      <Detail term={CHANNEL_PANEL_COPY.overrides}>
        {overrides.length > 0 ? overrides.join(', ') : CHANNEL_PANEL_COPY.noOverrides}
      </Detail>
    </dl>
  );
}

type ChannelActionsProps = Pick<
  ProductChannelSheetProps,
  'listingRef' | 'channel' | 'canEdit' | 'onEditOverrides'
>;

/** Adding the product to the store, changing it there, and seeing it on the store. */
function ChannelActions({ listingRef, channel, canEdit, onEditOverrides }: ChannelActionsProps) {
  const externalUrl = channel.listing?.externalUrl;
  return (
    <div className="flex flex-wrap items-start gap-2">
      {canEdit && !channel.selected && (
        <AddToStoreButton listingRef={listingRef} channel={channel} />
      )}
      {canEdit && channel.selected && (
        <Button type="button" variant="outline" size="xs" onClick={onEditOverrides}>
          <PencilLine data-icon="inline-start" />
          {CHANNEL_PANEL_COPY.editOverrides}
        </Button>
      )}
      {externalUrl && (
        <Button asChild variant="outline" size="xs">
          <a href={externalUrl} target="_blank" rel="noreferrer">
            <ExternalLink data-icon="inline-start" />
            {CHANNEL_PANEL_COPY.viewOnStore}
          </a>
        </Button>
      )}
    </div>
  );
}

/**
 * A store of the product's map, opened: where the product stands there and why, and what can
 * be done from here. Every action is one the product page already offers: fix, try again, add
 * to the store, edit the store's overrides, review AI suggestions, or open the store's listing.
 */
export function ProductChannelSheet({ suggestions, onClose, ...props }: ProductChannelSheetProps) {
  const { listingRef, channel, canEdit, onEditOverrides } = props;
  const fix = listingFixOf({
    displayState: channel.displayState,
    displayRequirement: channel.displayRequirement,
    missingRequirement: channel.listing?.missingRequirement,
  });
  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="gap-0 overflow-y-auto data-[side=right]:w-full data-[side=right]:sm:max-w-xl">
        <SheetHeader className="border-b">
          <SheetTitle>
            <StoreName connection={channel.connection} />
          </SheetTitle>
          <SheetDescription>{CHANNEL_PANEL_COPY.description}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-5 p-4">
          <ListingIssue
            state={channel.displayState}
            reason={channel.displayReason}
            fix={fix}
            listing={listingRef}
            canEdit={canEdit}
            canRetry={!needsReconnect(channel.connection.status)}
            onOpenOverride={onEditOverrides}
          />
          <ChannelDetails channel={channel} />
          <ChannelActions {...props} />
          {suggestions.length > 0 && (
            <section className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">{CHANNEL_PANEL_COPY.suggestionsTitle}</h3>
              <ReviewableSuggestions
                workspaceId={listingRef.workspaceId}
                suggestions={suggestions}
                canReview={canEdit}
              />
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
