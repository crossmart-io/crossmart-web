import { ExternalLink, Undo2, X } from 'lucide-react';
import { Link } from 'react-router';
import { ChannelProductState } from '@/api/schema';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { useReturnToState } from '@/components/navigation/return-to';
import { RelativeTime } from '@/components/time/RelativeTime';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { toProductRoute } from '@/config/routes';
import { ProductThumbnail } from '@/features/catalog';
import { CHANNEL_PRODUCT_STATE_HINTS, LISTING_SOURCE_LABELS } from '../listings.constants';
import type { ChannelProduct } from '../listings.types';
import { ChannelProductStateBadge } from './ChannelProductStateBadge';

interface ChannelProductRowProps {
  row: ChannelProduct;
  /** Removes the product from the store; absent for members who may not. */
  onRemove?: (productId: string) => Promise<unknown>;
  /** Adds a product removed by hand back to the store; absent for members who may not. */
  onAddBack?: (productId: string) => void;
}

function ProductCell({ row }: { row: ChannelProduct }) {
  const returnTo = useReturnToState();
  const error = row.state === ChannelProductState.failed ? row.listing?.lastError : null;
  return (
    <div className="flex min-w-0 items-center gap-3">
      <ProductThumbnail url={row.product.imageUrl} alt="" className="size-8" />
      <div className="flex min-w-0 flex-col">
        <Link
          to={toProductRoute(row.product.id)}
          state={returnTo}
          dir="auto"
          title={row.product.title}
          className="line-clamp-2 font-medium break-words hover:underline"
        >
          {row.product.title}
        </Link>
        {error && (
          <span className="line-clamp-2 text-xs text-destructive" title={error}>
            {error}
          </span>
        )}
      </div>
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

/** Under the state: why the product is in the store, or what its state means. */
function StateDetail({ row }: { row: ChannelProduct }) {
  const inStore = row.listing && row.state !== ChannelProductState.removed_by_hand;
  return (
    <span className="text-xs text-muted-foreground">
      {inStore && row.listing
        ? LISTING_SOURCE_LABELS[row.listing.source]
        : CHANNEL_PRODUCT_STATE_HINTS[row.state]}
    </span>
  );
}

/** What the row offers: removing a product in the store, or adding back one removed by hand. */
function RowAction({ row, onRemove, onAddBack }: ChannelProductRowProps) {
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

/** One product of the store: its state and why it is there, the last sync, and what to do. */
export function ChannelProductRow({ row, onRemove, onAddBack }: ChannelProductRowProps) {
  const externalUrl = row.listing?.externalUrl;
  return (
    <TableRow className="align-top">
      {/* Takes the width the other columns leave, so a long title wraps instead of widening the table. */}
      <TableCell className="w-full max-w-0 whitespace-normal">
        <ProductCell row={row} />
      </TableCell>
      <TableCell>
        <div className="flex flex-col items-start gap-1">
          <ChannelProductStateBadge state={row.state} />
          <StateDetail row={row} />
        </div>
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
