import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { PAGINATION_QUERY } from '@/config/routes';

export type SearchParamsUpdate = (params: URLSearchParams) => void;

/**
 * Edits the current query parameters in place. Filter changes replace the history entry,
 * so the back button leaves the page instead of stepping through every keystroke. A filter
 * change also goes back to the first page of the table.
 */
export function useSearchParamsUpdater(): (update: SearchParamsUpdate) => void {
  const [, setSearchParams] = useSearchParams();
  return useCallback(
    (update: SearchParamsUpdate) =>
      setSearchParams(
        (params) => {
          update(params);
          params.delete(PAGINATION_QUERY.page);
          return params;
        },
        { replace: true },
      ),
    [setSearchParams],
  );
}
