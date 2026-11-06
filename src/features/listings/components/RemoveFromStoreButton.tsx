import { X } from 'lucide-react';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { type ProductChannelRef, useRemoveFromStore } from '../hooks/useProductChannels';
import { LISTING_EDITOR_COPY } from '../listings.constants';

interface RemoveFromStoreButtonProps {
  listingRef: ProductChannelRef;
  store: string;
}

/** Takes the product off one store, after confirming; it stays in the catalog and other stores. */
export function RemoveFromStoreButton({ listingRef, store }: RemoveFromStoreButtonProps) {
  const remove = useRemoveFromStore(listingRef);
  return (
    <ConfirmDialog
      trigger={
        <Button type="button" variant="ghost" size="xs">
          <X data-icon="inline-start" />
          {LISTING_EDITOR_COPY.removeFromStore}
        </Button>
      }
      title={`Remove from ${store}?`}
      description={`It is taken off ${store} now. The product stays in your catalog and in your other stores.`}
      confirmLabel="Remove"
      onConfirm={() => remove.mutateAsync()}
    />
  );
}
