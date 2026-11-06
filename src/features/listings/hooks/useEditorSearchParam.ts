import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

export interface EditorSearchParam {
  /** The id the URL names, whose listing editor is open; null when none is. */
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
}

/**
 * Which listing editor is open, kept in one query parameter so the open editor can be linked
 * to and shared. Opening and closing replace the history entry, so Back leaves the page as it
 * would without the editor; the page's other parameters, such as its filters, stay as they are.
 */
export function useEditorSearchParam(name: string): EditorSearchParam {
  const [searchParams, setSearchParams] = useSearchParams();
  const open = useCallback(
    (id: string) =>
      setSearchParams(
        (params) => {
          params.set(name, id);
          return params;
        },
        { replace: true },
      ),
    [name, setSearchParams],
  );
  const close = useCallback(
    () =>
      setSearchParams(
        (params) => {
          params.delete(name);
          return params;
        },
        { replace: true },
      ),
    [name, setSearchParams],
  );
  return { openId: searchParams.get(name), open, close };
}
