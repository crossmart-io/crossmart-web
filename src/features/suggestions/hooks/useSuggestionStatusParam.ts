import { SuggestionStatus } from '@/api/schema';
import { useStatusParam } from '@/hooks/useStatusParam';

/** The inbox tab, kept in the URL so it can be linked to; pending when absent. */
export function useSuggestionStatusParam(): [SuggestionStatus, (status: SuggestionStatus) => void] {
  return useStatusParam(SuggestionStatus, SuggestionStatus.PENDING);
}
