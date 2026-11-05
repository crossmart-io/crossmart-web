import { useSearchParams } from 'react-router';
import { SuggestionStatus } from '@/api/schema';
import { ROUTE_QUERY } from '@/config/routes';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';

function toSuggestionStatus(value: string | null): SuggestionStatus {
  return (
    Object.values(SuggestionStatus).find((status) => status === value) ?? SuggestionStatus.PENDING
  );
}

/** The inbox tab, kept in the URL so it can be linked to; pending when absent. */
export function useSuggestionStatusParam(): [SuggestionStatus, (status: SuggestionStatus) => void] {
  const [searchParams] = useSearchParams();
  const update = useSearchParamsUpdater();
  const status = toSuggestionStatus(searchParams.get(ROUTE_QUERY.status));
  const setStatus = (next: SuggestionStatus) =>
    update((params) => {
      if (next === SuggestionStatus.PENDING) params.delete(ROUTE_QUERY.status);
      else params.set(ROUTE_QUERY.status, next);
    });
  return [status, setStatus];
}
