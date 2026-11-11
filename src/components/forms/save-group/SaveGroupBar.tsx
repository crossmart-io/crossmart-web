import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { SAVE_GROUP_COPY } from './save-group.constants';

interface SaveGroupBarProps {
  /** Something was edited; otherwise only an unfinished setup waits, and there is nothing to discard. */
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

/** Floats over the bottom of the page while a card of the group has something to save. */
export function SaveGroupBar({ hasChanges, isSaving, onSave, onDiscard }: SaveGroupBarProps) {
  return (
    <section
      aria-label={SAVE_GROUP_COPY.region}
      className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-xl animate-in items-center justify-between gap-3 rounded-xl border bg-popover px-4 py-2.5 text-popover-foreground shadow-lg fade-in slide-in-from-bottom-4 sm:inset-x-6"
    >
      <span className="text-sm font-medium" aria-live="polite">
        {hasChanges ? SAVE_GROUP_COPY.unsaved : SAVE_GROUP_COPY.unfinished}
      </span>
      <div className="flex items-center gap-2">
        {hasChanges && (
          <Button type="button" variant="ghost" size="sm" onClick={onDiscard} disabled={isSaving}>
            {SAVE_GROUP_COPY.discard}
          </Button>
        )}
        <Button type="button" size="sm" onClick={onSave} disabled={isSaving}>
          {isSaving && <Spinner data-icon="inline-start" />}
          {isSaving ? SAVE_GROUP_COPY.saving : SAVE_GROUP_COPY.save}
        </Button>
      </div>
    </section>
  );
}
