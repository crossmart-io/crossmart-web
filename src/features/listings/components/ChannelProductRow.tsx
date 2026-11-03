import { ExternalLink, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { ChannelProductState } from '@/api/schema';
import { useReturnToState } from '@/components/navigation/return-to';
import { RelativeTime } from '@/components/time/RelativeTime';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { toProductRoute } from '@/config/routes';
import { ProductThumbnail } from '@/features/catalog';
import { CHANNEL_PRODUCT_STATE_HINTS } from '../listings.constants';
import type { ChannelProduct } from '../listings.types';
import { ChannelProductStateBadge } from './ChannelProductStateBadge';

/** States of products the selection includes; the others can be added back. */
const SELECTED_STATES: ReadonlySet<ChannelProductState> = new Set([
  ChannelProductState.listed,
  ChannelProductState.pending,
  ChannelProductState.failed,
]);

interface ChannelProductRowProps {
  row: ChannelProduct;
  /** Adds or removes the product from this store's selection; absent for read-only members. */
  onToggle?: (productId: string, include: boolean) => void;
  isSaving: boolean;
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
          className="truncate font-medium hover:underline"
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

function ToggleButton({ row, onToggle, isSaving }: Required<ChannelProductRowProps>) {
  const include = !SELECTED_STATES.has(row.state);
  const label = `${include ? 'Add' : 'Remove'} ${row.product.title} ${include ? 'to' : 'from'} this store`;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={isSaving}
      aria-label={label}
      title={label}
      onClick={() => onToggle(row.product.id, include)}
    >
      {include ? <Plus /> : <Minus />}
    </Button>
  );
}

/** One product as this store sees it: its state, the last sync, and adding or removing it. */
export function ChannelProductRow({ row, onToggle, isSaving }: ChannelProductRowProps) {
  const externalUrl = row.listing?.externalUrl;
  return (
    <TableRow className="align-top">
      <TableCell>
        <ProductCell row={row} />
      </TableCell>
      <TableCell>
        <div className="flex flex-col items-start gap-1">
          <ChannelProductStateBadge state={row.state} />
          <span className="hidden text-xs text-muted-foreground md:inline">
            {CHANNEL_PRODUCT_STATE_HINTS[row.state]}
          </span>
        </div>
      </TableCell>
      <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
        {row.listing?.lastSyncedAt ? <RelativeTime value={row.listing.lastSyncedAt} /> : '—'}
      </TableCell>
      <TableCell className="w-20">
        <div className="flex items-center justify-end gap-1">
          {externalUrl && (
            <Button asChild variant="ghost" size="icon-sm">
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${row.product.title} on the channel`}
              >
                <ExternalLink />
              </a>
            </Button>
          )}
          {onToggle && <ToggleButton row={row} onToggle={onToggle} isSaving={isSaving} />}
        </div>
      </TableCell>
    </TableRow>
  );
}
