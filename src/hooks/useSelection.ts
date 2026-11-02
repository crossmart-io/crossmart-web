import { useCallback, useState } from 'react';

export interface Selection {
  ids: ReadonlySet<string>;
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  /** Selects all of `ids`, or clears them when they are all selected already. */
  toggleAll: (ids: readonly string[]) => void;
  clear: () => void;
}

/** Which rows of a list are checked, for bulk actions. */
export function useSelection(): Selection {
  const [ids, setIds] = useState<ReadonlySet<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setIds((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback((rowIds: readonly string[]) => {
    setIds((current) =>
      rowIds.every((id) => current.has(id)) ? new Set() : new Set([...current, ...rowIds]),
    );
  }, []);

  const clear = useCallback(() => setIds(new Set()), []);

  return { ids, isSelected: (id) => ids.has(id), toggle, toggleAll, clear };
}
