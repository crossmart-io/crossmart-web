import { useCallback, useMemo, useState } from 'react';
import { useAgentWorker } from '@/features/agent-worker';
import { useListingHealth } from '@/features/listing-health/hooks/useListingHealth';
import type { StoreListingHealth } from '@/features/listing-health/listing-health.types';
import { ConsoleTab } from '../agent-console.constants';
import { agentState, storesStatus } from '../console-status';
import { scrollToProposals } from '../scroll-to-proposals';
import { useAgentMapOverlay } from './useAgentMapOverlay';
import { useEventRefresh } from './useEventRefresh';
import { useWorkspaceEvents } from './useWorkspaceEvents';

const NO_STORES: readonly StoreListingHealth[] = [];

/**
 * Everything the Crossmart Agent page shows, in one place: the chat session, the events, the
 * map's overlay and the status bar's figures, the open tab (on narrow screens) and the node an
 * event points at.
 */
export function useAgentConsole(workspaceId: string) {
  const { canUse, session } = useAgentWorker();
  const feed = useWorkspaceEvents(workspaceId);
  useEventRefresh(feed.events);
  const health = useListingHealth(workspaceId);
  const stores = health.data?.stores ?? NO_STORES;
  const [tab, setTab] = useState(ConsoleTab.Chat);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  const openProposals = useCallback(() => {
    setTab(ConsoleTab.Chat);
    window.requestAnimationFrame(scrollToProposals);
  }, []);
  const overlay = useAgentMapOverlay({
    session,
    stores,
    highlightedNodeId,
    onOpenProposals: openProposals,
  });
  const status = useMemo(() => storesStatus(stores), [stores]);
  const agent = agentState({
    canUse,
    isBusy: session?.isBusy ?? false,
    proposedCount: session?.view.proposedActions.length ?? 0,
  });

  return {
    session,
    feed,
    overlay,
    stores: status,
    agent,
    tab,
    setTab,
    openProposals,
    highlight: setHighlightedNodeId,
  };
}

export type AgentConsoleState = ReturnType<typeof useAgentConsole>;
