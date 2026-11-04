import { Button } from '@/components/ui/button';

interface SaveBarProps {
  label: string;
  isSaving: boolean;
  onDiscard: () => void;
}

/** Sticky under the app header while there is something to save. */
export function SaveBar({ label, isSaving, onDiscard }: SaveBarProps) {
  return (
    <div className="sticky top-14 z-10 -mx-4 mb-6 flex items-center justify-between gap-3 border-b bg-foreground px-4 py-2.5 text-background sm:-mx-6 sm:px-6">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-background hover:bg-background/10 hover:text-background"
          onClick={onDiscard}
          disabled={isSaving}
        >
          Discard
        </Button>
        <Button type="submit" size="sm" variant="secondary" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
