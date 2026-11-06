import { PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LISTING_EDITOR_COPY } from '../../listings.constants';

interface ChangeForStoreButtonProps {
  /** The field's name, so the button says which field it opens. */
  name: string;
  onClick: () => void;
}

/** Starts this store's own value for a field that follows the product. */
export function ChangeForStoreButton({ name, onClick }: ChangeForStoreButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="xs"
      className="self-start"
      aria-label={`${LISTING_EDITOR_COPY.changeForStore}: ${name.toLowerCase()}`}
      onClick={onClick}
    >
      <PencilLine data-icon="inline-start" aria-hidden="true" />
      {LISTING_EDITOR_COPY.changeForStore}
    </Button>
  );
}
