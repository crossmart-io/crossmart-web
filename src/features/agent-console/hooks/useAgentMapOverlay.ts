import { useMemo } from 'react';
import { AgentWorkerActionStatus } from '@/api/schema';
import type { AgentWorkerAction, AgentWorkerSession } from '@/features/agent-worker';
import type { MapOverlay } from '@/features/channel-map';
import type { StoreListingHealth } from '@/features/listing-health/listing-health.types';
import { MIN_PULSE_MS } from '../agent-console.constants';
import { syncingStoreIds } from '../console-status';
import { actionNodeId, buildMapOverlay } from '../map-overlay';
import { type RecentChange, useRecentAgentChanges } from './useRecentAgentChanges';

const NO_ACTIONS: readonly AgentWorkerAction[] = [];

interface AgentMapOverlayInput {
  session: AgentWorkerSession | null;
  stores: readonly StoreListingHealth[];
  highlightedNodeId: string | null;
  onOpenProposals: () => void;
}

/**
 * Edges pulse while a change is made, for a few seconds after, and for as long as its store
 * still has listings on their way.
 */
function pulsingStores(
  live: readonly AgentWorkerAction[],
  recent: readonly RecentChange[],
  syncing: ReadonlySet<string>,
  now: number,
): Set<string> {
  const executing = live.filter((action) => action.status === AgentWorkerActionStatus.executing);
  const settling = recent.filter(
    ({ action, seenAt }) => now - seenAt < MIN_PULSE_MS || syncing.has(actionNodeId(action)),
  );
  return new Set(
    [...executing, ...settling.map(({ action }) => action)].flatMap(
      (action) => action.targets.connectionIds,
    ),
  );
}

/** Crossmart Agent's work laid over the map: the running turn and the changes just made. */
export function useAgentMapOverlay({
  session,
  stores,
  highlightedNodeId,
  onOpenProposals,
}: AgentMapOverlayInput): MapOverlay {
  const liveActions = session?.live.actions;
  const live = useMemo(
    () => (liveActions ? Object.values(liveActions) : NO_ACTIONS),
    [liveActions],
  );
  const { changes, now } = useRecentAgentChanges(live);
  const proposed = session?.view.proposedActions ?? NO_ACTIONS;
  return useMemo(() => {
    const liveIds = new Set(live.map(({ id }) => id));
    const settled = changes.filter(({ action }) => !liveIds.has(action.id));
    return buildMapOverlay({
      actions: [...settled.map(({ action }) => action), ...live],
      proposed,
      pulsingStoreIds: pulsingStores(live, changes, syncingStoreIds(stores), now),
      highlightedNodeId,
      onOpenProposals,
    });
  }, [live, changes, now, proposed, stores, highlightedNodeId, onOpenProposals]);
}
