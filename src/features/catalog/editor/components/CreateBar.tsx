import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CREATE_BAR_COPY } from '../../catalog.constants';
import { SaveIntent } from '../save-intent';

interface CreateBarProps {
  /** Whether the stores chosen get the product; otherwise the main button only saves it. */
  publishes: boolean;
  isSaving: boolean;
  /** Uploads still running; saving now would drop them. */
  isBusy: boolean;
  onSave: (intent: SaveIntent) => void;
}

/**
 * The new product's save bar: publish in one click, or keep it as a draft. Floats over the
 * bottom of the page like the edit save bar, so the field being typed in never moves.
 */
export function CreateBar({ publishes, isSaving, isBusy, onSave }: CreateBarProps) {
  const disabled = isSaving || isBusy;
  return (
    <section
      aria-label={CREATE_BAR_COPY.label}
      className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-xl animate-in items-center justify-between gap-3 rounded-xl border bg-popover px-4 py-2.5 text-popover-foreground shadow-lg fade-in slide-in-from-bottom-4 sm:inset-x-6"
    >
      <span className="truncate text-sm font-medium" aria-live="polite">
        {isBusy ? CREATE_BAR_COPY.uploading : CREATE_BAR_COPY.newProduct}
      </span>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={() => onSave(SaveIntent.Draft)}
        >
          {CREATE_BAR_COPY.draft}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={disabled}
          onClick={() => onSave(SaveIntent.Publish)}
        >
          {isSaving && <Spinner data-icon="inline-start" />}
          {publishes ? CREATE_BAR_COPY.publish : CREATE_BAR_COPY.save}
        </Button>
      </div>
    </section>
  );
}
