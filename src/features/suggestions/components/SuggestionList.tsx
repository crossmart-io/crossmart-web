import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Selection } from '@/hooks/useSelection';
import { useSuggestionReview } from '../hooks/useSuggestionReview';
import type { Suggestion } from '../suggestions.types';
import { SuggestionCard, type SuggestionReviewActions } from './SuggestionCard';

interface SuggestionListProps {
  workspaceId: string;
  suggestions: readonly Suggestion[];
  /** Absent when the user may not review, so nothing can be selected or approved. */
  selection?: Selection;
}

function useReviewActions(workspaceId: string): SuggestionReviewActions {
  const { approve, reject } = useSuggestionReview(workspaceId);
  const [busyId, setBusyId] = useState<string>();
  const run = (mutation: typeof approve) => (suggestionId: string) => {
    setBusyId(suggestionId);
    mutation.mutate(suggestionId, { onSettled: () => setBusyId(undefined) });
  };
  return { onApprove: run(approve), onReject: run(reject), busyId };
}

/** The suggestions of one inbox page, each with its diff and, for reviewers, its actions. */
export function SuggestionList({ workspaceId, suggestions, selection }: SuggestionListProps) {
  const review = useReviewActions(workspaceId);
  const ids = suggestions.map((suggestion) => suggestion.id);
  return (
    <div className="flex flex-col gap-3">
      {selection && (
        <div>
          <Button variant="ghost" size="sm" onClick={() => selection.toggleAll(ids)}>
            {ids.every((id) => selection.isSelected(id))
              ? 'Clear selection'
              : 'Select all on this page'}
          </Button>
        </div>
      )}
      <ul className="flex flex-col gap-3">
        {suggestions.map((suggestion) => (
          <li key={suggestion.id}>
            <SuggestionCard
              suggestion={suggestion}
              review={selection ? review : undefined}
              selected={selection?.isSelected(suggestion.id)}
              onToggleSelected={selection ? () => selection.toggle(suggestion.id) : undefined}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
