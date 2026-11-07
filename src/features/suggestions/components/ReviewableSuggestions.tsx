import { useSuggestionReviewActions } from '../hooks/useSuggestionReview';
import type { Suggestion } from '../suggestions.types';
import { SuggestionCard } from './SuggestionCard';

interface ReviewableSuggestionsProps {
  workspaceId: string;
  suggestions: readonly Suggestion[];
  /** Whether the member may approve and reject; otherwise the suggestions are only shown. */
  canReview: boolean;
}

/** A few suggestions shown where they apply, such as a store's panel, each to approve or reject. */
export function ReviewableSuggestions({
  workspaceId,
  suggestions,
  canReview,
}: ReviewableSuggestionsProps) {
  const review = useSuggestionReviewActions(workspaceId);
  return (
    <ul className="flex flex-col gap-3">
      {suggestions.map((suggestion) => (
        <li key={suggestion.id}>
          <SuggestionCard suggestion={suggestion} review={canReview ? review : undefined} />
        </li>
      ))}
    </ul>
  );
}
