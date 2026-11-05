import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { Selection } from '@/hooks/useSelection';
import { pluralize } from '@/lib/format';
import { useBulkApproveSuggestions } from '../hooks/useSuggestionReview';

interface SuggestionsBulkBarProps {
  workspaceId: string;
  selection: Selection;
}

/** Floats over the inbox while suggestions are selected, like the products' bulk bar. */
export function SuggestionsBulkBar({ workspaceId, selection }: SuggestionsBulkBarProps) {
  const bulkApprove = useBulkApproveSuggestions(workspaceId);
  const ids = [...selection.ids];
  const busy = bulkApprove.isPending;
  return (
    <section
      aria-label="Bulk review"
      className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-xl animate-in items-center gap-2 rounded-xl border bg-popover px-3 py-2 text-popover-foreground shadow-lg fade-in slide-in-from-bottom-4 sm:inset-x-6"
    >
      <span className="mr-auto flex items-center gap-2 pl-1 text-sm font-medium" aria-live="polite">
        {busy && <Spinner />}
        {pluralize(ids.length, 'suggestion')} selected
      </span>
      <Button
        size="sm"
        disabled={busy}
        onClick={() => void bulkApprove.mutateAsync(ids).then(selection.clear)}
      >
        <Check data-icon="inline-start" />
        Approve {pluralize(ids.length, 'suggestion')}
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={selection.clear} aria-label="Clear selection">
        <X />
      </Button>
    </section>
  );
}
