import { useState } from 'react';
import type { WorkspaceEvent } from '../agent-console.types';

/**
 * How many events arrived since the person last looked at them; nothing is unseen while they
 * look, and the history the page opened with counts as seen.
 */
export function useUnseenCount(events: readonly WorkspaceEvent[], isViewing: boolean): number {
  const newest = events.at(-1)?.id ?? null;
  const [seenId, setSeenId] = useState<string | null>(null);
  const [hasHistory, setHasHistory] = useState(false);
  // Adjusted while rendering, as React suggests for state that follows props.
  if (newest !== null && !hasHistory) {
    setHasHistory(true);
    setSeenId(newest);
  } else if (isViewing && seenId !== newest) {
    setSeenId(newest);
  }
  if (isViewing || !hasHistory) return 0;
  return events.length - (events.findIndex(({ id }) => id === seenId) + 1);
}
