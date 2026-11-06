import { ExternalLink, Undo2, X } from 'lucide-react';
import type { MouseEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ChannelProductState, ListingDisplayState } from '@/api/schema';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { RelativeTime } from '@/components/time/RelativeTime';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { ROUTE_QUERY } from '@/config/routes';
import { ProductThumbnail } from '@/features/catalog';
import { listingFixOf } from '../listing-fix';
import { hasListingReason, LISTING_STATE_PRESENTATION } from '../listing-states';
import { LISTING_SOURCE_LABELS, LISTINGS_ROW_COPY } from '../listings.constants';
import type { ChannelProduct, ListingStore } from '../listings.types';
import { ListingIssue } from './ListingIssue';
import { ListingStateBadge } from './ListingStateBadge';

interface ChannelProductRowProps {
  row: ChannelProduct;
  store: ListingStore;
  /** Whether the member may edit listings: retry them and fix their overrides. */
  canEdit: boolean;
  /** Opens the product's listing editor over the list. */
  onOpenListing: (productId: string) => void;
  /** Removes the product from the store; absent for members who may not. */
  onRemove?: (productId: string) => Promise<unknown>;
  /** Adds a product removed by hand back to the store; absent for members who may not. */
  onAddBack?: (productId: string) => void;
}

/** Clicks on these inside a row do their own thing instead of opening the listing. */
const ROW_CONTROLS = 'a, button, input, [role="dialog"], [role="alertdialog"]';

/** This page with the product's listing editor open, keeping the list's filters and page. */
function useListingSearch(productId: string): string {
  const [searchParams] = useSearchParams();
  const next = new URLSearchParams(searchParams);
  next.set(ROUTE_QUERY.listingProduct, productId);
  return `?${next}`;
}

function ProductCell({ row }: { row: ChannelProduct }) {
  const listingSearch = useListingSearch(row.product.id);
  return (
    <div className="flex min-w-0 items-center gap-3">
      <ProductThumbnail url={row.product.imageUrl} alt="" className="size-8" />
      <Link
        to={{ search: listingSearch }}
        replace
        dir="auto"
        title={row.product.title}
        className="line-clamp-2 min-w-0 font-medium break-words hover:underline"
      >
        {row.product.title}
      </Link>
    </div>
  );
}

function RemoveButton({
  row,
  onRemove,
}: Required<Pick<ChannelProductRowProps, 'row' | 'onRemove'>>) {
  const label = `Remove ${row.product.title} from this store`;
  return (
    <ConfirmDialog
      trigger={
        <Button type="button" variant="ghost" size="icon-sm" aria-label={label} title={label}>
          <X />
        </Button>
      }
      title={`Remove ${row.product.title}?`}
      description="It is taken off this store now. The product stays in your catalog and in your other stores."
      confirmLabel="Remove"
      onConfirm={() => onRemove(row.product.id)}
    />
  );
}

/** Under a state with nothing to fix: why the product is in the store, or what the state means. */
function StateHint({ row }: { row: ChannelProduct }) {
  const queuedAt = row.listing?.syncRequestedAt;
  if (row.displayState === ListingDisplayState.publishing && queuedAt) {
    return (
      <span className="text-xs text-muted-foreground">
        {LISTINGS_ROW_COPY.queued} <RelativeTime value={queuedAt} />
      </span>
    );
  }
  const inStore = row.listing && row.state !== ChannelProductState.removed_by_hand;
  return (
    <span className="text-xs text-muted-foreground">
      {inStore && row.listing
        ? LISTING_SOURCE_LABELS[row.listing.source]
        : LISTING_STATE_PRESENTATION[row.displayState].hint}
    </span>
  );
}

/** The state, and beside it the reason, the fix and a retry, or else a short hint. */
function StateCell({
  row,
  store,
  canEdit,
  onOpenListing,
}: Pick<ChannelProductRowProps, 'row' | 'store' | 'canEdit' | 'onOpenListing'>) {
  const fix = listingFixOf({
    displayState: row.displayState,
    displayRequirement: row.displayRequirement,
    missingRequirement: row.listing?.missingRequirement,
  });
  return (
    <div className="flex flex-col items-start gap-1.5 sm:w-60">
      <ListingStateBadge state={row.displayState} />
      {hasListingReason(row.displayState) ? (
        <ListingIssue
          state={row.displayState}
          reason={row.displayReason}
          fix={fix}
          listing={{
            workspaceId: store.workspaceId,
            connectionId: store.connectionId,
            productId: row.product.id,
          }}
          canEdit={canEdit}
          canRetry={store.connected}
          onOpenOverride={() => onOpenListing(row.product.id)}
        />
      ) : (
        <StateHint row={row} />
      )}
    </div>
  );
}

/** What the row offers: removing a product in the store, or adding back one removed by hand. */
function RowAction({
  row,
  onRemove,
  onAddBack,
}: Pick<ChannelProductRowProps, 'row' | 'onRemove' | 'onAddBack'>) {
  if (row.state === ChannelProductState.removed_by_hand) {
    return onAddBack ? (
      <Button type="button" variant="outline" size="sm" onClick={() => onAddBack(row.product.id)}>
        <Undo2 data-icon="inline-start" />
        Add back
      </Button>
    ) : null;
  }
  if (!onRemove || row.state === ChannelProductState.removing) return null;
  return <RemoveButton row={row} onRemove={onRemove} />;
}

/**
 * One product of the store: where it stands and what to do about it, the last sync, actions.
 * Clicking the row, or its title, opens the product's listing editor over the list.
 */
export function ChannelProductRow({
  row,
  store,
  canEdit,
  onOpenListing,
  onRemove,
  onAddBack,
}: ChannelProductRowProps) {
  const externalUrl = row.listing?.externalUrl;
  const openFromRow = (event: MouseEvent<HTMLTableRowElement>) => {
    if (event.target instanceof Element && event.target.closest(ROW_CONTROLS)) return;
    onOpenListing(row.product.id);
  };
  return (
    <TableRow className="cursor-pointer align-top" onClick={openFromRow}>
      {/* Takes the width the other columns leave, so a long title wraps instead of widening the table. */}
      <TableCell className="w-full max-w-0 whitespace-normal">
        <ProductCell row={row} />
      </TableCell>
      <TableCell className="whitespace-normal">
        <StateCell row={row} store={store} canEdit={canEdit} onOpenListing={onOpenListing} />
      </TableCell>
      <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
        {row.listing?.lastSyncedAt ? <RelativeTime value={row.listing.lastSyncedAt} /> : '—'}
      </TableCell>
      <TableCell className="w-28">
        <div className="flex items-center justify-end gap-1">
          {externalUrl && (
            <Button asChild variant="ghost" size="icon-sm">
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${row.product.title} in the store`}
              >
                <ExternalLink />
              </a>
            </Button>
          )}
          <RowAction row={row} onRemove={onRemove} onAddBack={onAddBack} />
        </div>
      </TableCell>
    </TableRow>
  );
}
