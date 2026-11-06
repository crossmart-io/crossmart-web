import { useSearchParams } from 'react-router';
import { SuggestionStatus } from '@/api/schema';
import { ROUTE_QUERY } from '@/config/routes';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { parseEnum } from '@/lib/enum';

/** The inbox tab, kept in the URL so it can be linked to; pending when absent. */
export function useSuggestionStatusParam(): [SuggestionStatus, (status: SuggestionStatus) => void] {
  const [searchParams] = useSearchParams();
  const update = useSearchParamsUpdater();
  const status =
    parseEnum(SuggestionStatus, searchParams.get(ROUTE_QUERY.status)) ?? SuggestionStatus.PENDING;
  const setStatus = (next: SuggestionStatus) =>
    update((params) => {
      if (next === SuggestionStatus.PENDING) params.delete(ROUTE_QUERY.status);
      else params.set(ROUTE_QUERY.status, next);
    });
  return [status, setStatus];
}
