import { Link2, PencilLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FieldOrigin } from '../../listing-editor';
import { LISTING_EDITOR_COPY } from '../../listings.constants';

/** Whether a field follows the product or is changed for this store, in words and an icon. */
export function FieldOriginBadge({ origin }: { origin: FieldOrigin }) {
  if (origin === FieldOrigin.Store) {
    return (
      <Badge variant="default" data-origin={origin}>
        <PencilLine data-icon="inline-start" aria-hidden="true" />
        {LISTING_EDITOR_COPY.changedForStore}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" data-origin={origin} className="text-muted-foreground">
      <Link2 data-icon="inline-start" aria-hidden="true" />
      {LISTING_EDITOR_COPY.fromProduct}
    </Badge>
  );
}
