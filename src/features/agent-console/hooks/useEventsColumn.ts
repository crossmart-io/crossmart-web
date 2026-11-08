import { useCallback, useState } from 'react';
import { readEventsCollapsed, storeEventsCollapsed } from '../events-panel-storage';

export interface EventsColumn {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

/** Whether the Events column is hidden on a wide screen, as the person last left it. */
export function useEventsColumn(): EventsColumn {
  const [collapsed, setState] = useState(readEventsCollapsed);
  const setCollapsed = useCallback((next: boolean) => {
    setState(next);
    storeEventsCollapsed(next);
  }, []);
  return { collapsed, setCollapsed };
}
