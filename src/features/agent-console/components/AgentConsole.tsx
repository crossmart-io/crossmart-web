import type { ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CONSOLE_COLUMNS_MEDIA_QUERY, ConsoleTab } from '../agent-console.constants';
import { type AgentConsoleState, useAgentConsole } from '../hooks/useAgentConsole';
import { AgentMapPanel } from './AgentMapPanel';
import { ChatPanel } from './ChatPanel';
import { ConsoleColumns } from './ConsoleColumns';
import { ConsoleTabs } from './ConsoleTabs';
import { EventStreamPanel } from './EventStreamPanel';

export type ConsolePanels = Record<ConsoleTab, ReactNode>;

function panelsOf(workspaceId: string, state: AgentConsoleState): ConsolePanels {
  return {
    [ConsoleTab.Chat]: <ChatPanel session={state.session} />,
    [ConsoleTab.Map]: (
      <AgentMapPanel
        workspaceId={workspaceId}
        overlay={state.overlay}
        stores={state.stores}
        agent={state.agent}
      />
    ),
    [ConsoleTab.Events]: (
      <EventStreamPanel
        events={state.feed.events}
        status={state.feed.status}
        onHighlight={state.highlight}
        onOpenProposals={state.openProposals}
      />
    ),
  };
}

/**
 * The Crossmart Agent page: the chat, the live map and the event stream side by side on a wide
 * screen, or as tabs on a narrow one.
 */
export function AgentConsole({ workspaceId }: { workspaceId: string }) {
  const state = useAgentConsole(workspaceId);
  const wide = useMediaQuery(CONSOLE_COLUMNS_MEDIA_QUERY);
  const panels = panelsOf(workspaceId, state);
  if (wide) return <ConsoleColumns panels={panels} />;
  return <ConsoleTabs panels={panels} state={state} />;
}
