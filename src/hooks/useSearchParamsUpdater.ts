import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

export type SearchParamsUpdate = (params: URLSearchParams) => void;

/**
 * Edits the current query parameters in place. Filter changes replace the history entry,
 * so the back button leaves the page instead of stepping through every keystroke.
 */
export function useSearchParamsUpdater(): (update: SearchParamsUpdate) => void {
  const [, setSearchParams] = useSearchParams();
  return useCallback(
    (update: SearchParamsUpdate) =>
      setSearchParams(
        (params) => {
          update(params);
          return params;
        },
        { replace: true },
      ),
    [setSearchParams],
  );
}
