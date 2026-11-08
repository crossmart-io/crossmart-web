import { useEffect, useMemo, useState } from 'react';
import { AgentWorkerActionStatus, AgentWorkerToolKind } from '@/api/schema';
import type { AgentWorkerAction } from '@/features/agent-worker';
import { MS_PER_SECOND } from '@/lib/time';
import { RECENT_CHANGE_MS } from '../agent-console.constants';

const SETTLED_STATUSES: readonly AgentWorkerActionStatus[] = [
  AgentWorkerActionStatus.executed,
  AgentWorkerActionStatus.execution_failed,
];

/** A change the agent made, and when the page saw it made. */
export interface RecentChange {
  action: AgentWorkerAction;
  seenAt: number;
}

type RecentChanges = Readonly<Record<string, RecentChange>>;

function isSettledChange(action: AgentWorkerAction): boolean {
  return action.kind === AgentWorkerToolKind.write && SETTLED_STATUSES.includes(action.status);
}

/** The kept changes plus any settled change not kept yet; the same object when none is new. */
function withSettled(kept: RecentChanges, live: readonly AgentWorkerAction[], seenAt: number) {
  const added = live.filter((action) => isSettledChange(action) && !kept[action.id]);
  if (!added.length) return kept;
  return { ...kept, ...Object.fromEntries(added.map((action) => [action.id, { action, seenAt }])) };
}

function withoutExpired(kept: RecentChanges, now: number): RecentChanges {
  const fresh = Object.values(kept).filter(({ seenAt }) => now - seenAt < RECENT_CHANGE_MS);
  if (fresh.length === Object.keys(kept).length) return kept;
  return Object.fromEntries(fresh.map((change) => [change.action.id, change]));
}

/**
 * Changes Crossmart Agent made in the last few seconds, kept after its turn ends (when the live
 * state is dropped), so the map can show them applied and their stores' edges syncing. `now`
 * ticks every second while any is kept.
 */
export function useRecentAgentChanges(liveActions: readonly AgentWorkerAction[]) {
  const [changes, setChanges] = useState<RecentChanges>({});
  const [now, setNow] = useState(() => Date.now());
  const [seenLive, setSeenLive] = useState(liveActions);
  // Adjusted while rendering, as React suggests for state that follows props.
  if (seenLive !== liveActions) {
    setSeenLive(liveActions);
    setChanges(withSettled(changes, liveActions, now));
  }

  const count = Object.keys(changes).length;
  useEffect(() => {
    if (!count) return undefined;
    const ticker = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      setChanges((kept) => withoutExpired(kept, current));
    }, MS_PER_SECOND);
    return () => window.clearInterval(ticker);
  }, [count]);

  return { changes: useMemo(() => Object.values(changes), [changes]), now };
}
