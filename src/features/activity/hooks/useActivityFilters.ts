import { useSearchParams } from 'react-router';
import { type ActivityAction, ActivityOutcome } from '@/api/schema';
import { ACTIVITY_ROUTE_QUERY } from '@/config/routes';
import { toActivityAction } from '../activity-action';

export interface ActivityFilters {
  action: ActivityAction | undefined;
  setAction: (action: ActivityAction | undefined) => void;
  failuresOnly: boolean;
  setFailuresOnly: (failuresOnly: boolean) => void;
  isFiltered: boolean;
  clearAll: () => void;
}

/** The action and "failures only" filters, kept in the URL. Updates replace the history entry. */
export function useActivityFilters(): ActivityFilters {
  const [searchParams, setSearchParams] = useSearchParams();
  const action = toActivityAction(searchParams.get(ACTIVITY_ROUTE_QUERY.action));
  const failuresOnly = searchParams.get(ACTIVITY_ROUTE_QUERY.outcome) === ActivityOutcome.FAILED;

  const update = (key: string, value: string | undefined) =>
    setSearchParams(
      (params) => {
        if (value) params.set(key, value);
        else params.delete(key);
        return params;
      },
      { replace: true },
    );

  return {
    action,
    setAction: (next) => update(ACTIVITY_ROUTE_QUERY.action, next),
    failuresOnly,
    setFailuresOnly: (next) =>
      update(ACTIVITY_ROUTE_QUERY.outcome, next ? ActivityOutcome.FAILED : undefined),
    isFiltered: Boolean(action) || failuresOnly,
    clearAll: () =>
      setSearchParams(
        (params) => {
          Object.values(ACTIVITY_ROUTE_QUERY).forEach((key) => params.delete(key));
          return params;
        },
        { replace: true },
      ),
  };
}
