import { useCallback, useState } from 'react';
import { readFullPageSidebarOpen, storeFullPageSidebarOpen } from './full-page-sidebar-storage';
import { PageLayout } from './page-layout';

export interface ShellSidebar {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * The sidebar's state for the page's layout. Reading pages share one state, open by default.
 * Full-window pages (Crossmart Agent) start with it collapsed to its icons, for room, and keep
 * what the person chose there; leaving one restores the reading pages' state.
 */
export function useShellSidebar(layout: PageLayout): ShellSidebar {
  const [columnOpen, setColumnOpen] = useState(true);
  const [fullOpen, setFullOpen] = useState(readFullPageSidebarOpen);
  const isFull = layout === PageLayout.Full;

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!isFull) return setColumnOpen(open);
      setFullOpen(open);
      storeFullPageSidebarOpen(open);
    },
    [isFull],
  );

  return { open: isFull ? fullOpen : columnOpen, onOpenChange };
}
