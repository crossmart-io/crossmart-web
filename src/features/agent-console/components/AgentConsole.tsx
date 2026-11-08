import type { ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CONSOLE_COLUMNS_MEDIA_QUERY, ConsoleTab } from '../agent-console.constants';
import { type AgentConsoleState, useAgentConsole } from '../hooks/useAgentConsole';
import { useEventsColumn } from '../hooks/useEventsColumn';
import { AgentMapPanel } from './AgentMapPanel';
import { ChatPanel } from './ChatPanel';
import { ConsoleColumns } from './ConsoleColumns';
import { ConsoleTabs } from './ConsoleTabs';
import { EventStreamPanel } from './EventStreamPanel';
import { HideEventsButton } from './EventsColumnToggle';

export type ConsolePanels = Record<ConsoleTab, ReactNode>;

function panelsOf(
  workspaceId: string,
  state: AgentConsoleState,
  eventsAction?: ReactNode,
): ConsolePanels {
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
        headerAction={eventsAction}
      />
    ),
  };
}

/**
 * The Crossmart Agent page: the chat, the live map and the event stream side by side on a wide
 * screen (the events can be hidden, for a wider map), or as tabs on a narrow one.
 */
export function AgentConsole({ workspaceId }: { workspaceId: string }) {
  const state = useAgentConsole(workspaceId);
  const events = useEventsColumn();
  const wide = useMediaQuery(CONSOLE_COLUMNS_MEDIA_QUERY);
  if (!wide) return <ConsoleTabs panels={panelsOf(workspaceId, state)} state={state} />;
  const hide = <HideEventsButton onHide={() => events.setCollapsed(true)} />;
  return (
    <ConsoleColumns panels={panelsOf(workspaceId, state, hide)} state={state} events={events} />
  );
}
