import { useSearchParams } from 'react-router';
import { ROUTE_QUERY } from '@/config/routes';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { parseEnum } from '@/lib/enum';

/**
 * A list's status tab, kept in the URL (`?status=`) so it can be linked to. `fallback` is the
 * tab shown when the URL names none, and it is left out of the URL.
 */
export function useStatusParam<Status extends string>(
  statuses: Record<string, Status>,
  fallback: Status,
): [Status, (status: Status) => void] {
  const [searchParams] = useSearchParams();
  const update = useSearchParamsUpdater();
  const status = parseEnum(statuses, searchParams.get(ROUTE_QUERY.status)) ?? fallback;
  const setStatus = (next: Status) =>
    update((params) => {
      if (next === fallback) params.delete(ROUTE_QUERY.status);
      else params.set(ROUTE_QUERY.status, next);
    });
  return [status, setStatus];
}
