import { useSearchParams } from 'react-router';
import { type ActivityAction, ActivityOutcome } from '@/api/schema';
import { ACTIVITY_ROUTE_QUERY } from '@/config/routes';
import { useSearchParamsUpdater } from '@/hooks/useSearchParamsUpdater';
import { setOrDeleteParam } from '@/lib/search-params';
import {
  type ByTime,
  type SortOption,
  TIME_SORTS,
  toSortOption,
} from '@/components/lists/sort-options';
import { toActivityAction } from '../activity-action';

export interface ActivityFilters {
  action: ActivityAction | undefined;
  setAction: (action: ActivityAction | undefined) => void;
  failuresOnly: boolean;
  setFailuresOnly: (failuresOnly: boolean) => void;
  sort: SortOption<ByTime>;
  setSort: (value: string) => void;
  isFiltered: boolean;
  clearAll: () => void;
}

/** The action and "failures only" filters, kept in the URL. Updates replace the history entry. */
export function useActivityFilters(): ActivityFilters {
  const [searchParams] = useSearchParams();
  const updateParams = useSearchParamsUpdater();
  const action = toActivityAction(searchParams.get(ACTIVITY_ROUTE_QUERY.action));
  const failuresOnly = searchParams.get(ACTIVITY_ROUTE_QUERY.outcome) === ActivityOutcome.FAILED;
  const sort = toSortOption(TIME_SORTS, searchParams.get(ACTIVITY_ROUTE_QUERY.sort));

  return {
    action,
    setAction: (next) =>
      updateParams((params) => setOrDeleteParam(params, ACTIVITY_ROUTE_QUERY.action, next ?? '')),
    failuresOnly,
    setFailuresOnly: (next) =>
      updateParams((params) =>
        setOrDeleteParam(params, ACTIVITY_ROUTE_QUERY.outcome, next ? ActivityOutcome.FAILED : ''),
      ),
    sort,
    setSort: (value) =>
      updateParams((params) =>
        setOrDeleteParam(
          params,
          ACTIVITY_ROUTE_QUERY.sort,
          value === TIME_SORTS[0].value ? '' : value,
        ),
      ),
    isFiltered: Boolean(action) || failuresOnly,
    clearAll: () =>
      updateParams((params) =>
        Object.values(ACTIVITY_ROUTE_QUERY).forEach((key) => params.delete(key)),
      ),
  };
}
