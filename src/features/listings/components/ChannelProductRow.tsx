import { ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router';
import { ChannelProductState } from '@/api/schema';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { useReturnToState } from '@/components/navigation/return-to';
import { RelativeTime } from '@/components/time/RelativeTime';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { toProductRoute } from '@/config/routes';
import { ProductThumbnail } from '@/features/catalog';
import { CHANNEL_PRODUCT_STATE_HINTS } from '../listings.constants';
import type { ChannelProduct } from '../listings.types';
import { ChannelProductStateBadge } from './ChannelProductStateBadge';

interface ChannelProductRowProps {
  row: ChannelProduct;
  /** Removes the product from the store; absent for members who may not. */
  onRemove?: (productId: string) => Promise<unknown>;
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

function RemoveButton({ row, onRemove }: Required<ChannelProductRowProps>) {
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

/** One product in this store: its state, the last sync, a link to it there, and removing it. */
export function ChannelProductRow({ row, onRemove }: ChannelProductRowProps) {
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
          {onRemove && row.state !== ChannelProductState.removing && (
            <RemoveButton row={row} onRemove={onRemove} />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
