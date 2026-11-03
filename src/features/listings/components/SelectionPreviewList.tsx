import { X } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useReturnToState } from '@/components/navigation/return-to';
import { toProductRoute } from '@/config/routes';
import { ProductStatusBadge, ProductThumbnail } from '@/features/catalog';
import { pluralize } from '@/lib/format';
import type { SelectionPreview } from '../listings.types';

interface SelectionPreviewListProps {
  preview: SelectionPreview | undefined;
  canEdit: boolean;
  onRemove: (productId: string) => void;
}

const PREVIEW_SKELETON_ROWS = 3;

function PreviewCounts({ preview }: { preview: SelectionPreview }) {
  const manual = [
    preview.addedManually > 0 && `${pluralize(preview.addedManually, 'product')} added by hand`,
    preview.removedManually > 0 && `${pluralize(preview.removedManually, 'product')} removed`,
  ].filter(Boolean);
  return (
    <p className="text-sm" aria-live="polite">
      <span className="font-semibold tabular-nums">{pluralize(preview.total, 'product')}</span>{' '}
      <span className="text-muted-foreground">
        selected{manual.length > 0 ? ` · ${manual.join(' · ')}` : ''}
      </span>
    </p>
  );
}

/** What the selection lists: the count, and its first products in title order. */
export function SelectionPreviewList({ preview, canEdit, onRemove }: SelectionPreviewListProps) {
  const returnTo = useReturnToState();
  if (!preview) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: PREVIEW_SKELETON_ROWS }, (_, row) => (
          <Skeleton key={row} className="h-10 w-full" />
        ))}
      </div>
    );
  }
  const more = preview.total - preview.items.length;
  return (
    <div className="flex flex-col gap-2">
      <PreviewCounts preview={preview} />
      <ul className="divide-y rounded-lg border">
        {preview.items.map((product) => (
          <li key={product.id} className="flex items-center gap-3 px-3 py-2">
            <ProductThumbnail url={product.imageUrl} alt="" className="size-8" />
            <Link
              to={toProductRoute(product.id)}
              state={returnTo}
              className="min-w-0 flex-1 truncate text-sm hover:underline"
            >
              {product.title}
            </Link>
            <ProductStatusBadge status={product.status} />
            {canEdit && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${product.title} from this channel`}
                onClick={() => onRemove(product.id)}
              >
                <X />
              </Button>
            )}
          </li>
        ))}
        {preview.items.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted-foreground">
            No products selected.
          </li>
        )}
      </ul>
      {more > 0 && (
        <p className="text-xs text-muted-foreground">and {pluralize(more, 'more product')}</p>
      )}
    </div>
  );
}
