import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Spinner } from '@/components/ui/spinner';
import { shortcutAria, shortcutLabel } from '@/lib/platform';

const SAVE_KEY = 'S';

interface SaveBarProps {
  label: string;
  isSaving: boolean;
  /** Uploads still running; saving now would drop them. */
  isBusy: boolean;
  onDiscard: () => void;
}

/**
 * Floats over the bottom of the page while there is something to save. It overlays the
 * content instead of pushing it, so the field being typed in never moves.
 */
export function SaveBar({ label, isSaving, isBusy, onDiscard }: SaveBarProps) {
  return (
    <section
      aria-label="Save changes"
      className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-xl animate-in items-center justify-between gap-3 rounded-xl border bg-popover px-4 py-2.5 text-popover-foreground shadow-lg fade-in slide-in-from-bottom-4 sm:inset-x-6"
    >
      <span className="text-sm font-medium" aria-live="polite">
        {isBusy ? 'Uploading images…' : label}
      </span>
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDiscard} disabled={isSaving}>
          Discard
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSaving || isBusy}
          aria-keyshortcuts={shortcutAria(SAVE_KEY)}
        >
          {isSaving && <Spinner data-icon="inline-start" />}
          {isSaving ? 'Saving…' : 'Save'}
          {!isSaving && (
            <Kbd className="hidden bg-primary-foreground/15 text-primary-foreground sm:inline-flex">
              {shortcutLabel(SAVE_KEY)}
            </Kbd>
          )}
        </Button>
      </div>
    </section>
  );
}
