import { cn } from '@/lib/utils';
import { ConsoleTab, EVENTS_COLUMN_ID } from '../agent-console.constants';
import type { AgentConsoleState } from '../hooks/useAgentConsole';
import type { EventsColumn } from '../hooks/useEventsColumn';
import { useUnseenCount } from '../hooks/useUnseenCount';
import type { ConsolePanels } from './AgentConsole';
import { EventsRail } from './EventsColumnToggle';

const COLUMN = 'min-h-0 overflow-hidden rounded-xl border bg-background';

/** Chat, map and events side by side, each scrolling on its own; a hidden Events column leaves a rail. */
export function ConsoleColumns({
  panels,
  state,
  events,
}: {
  panels: ConsolePanels;
  state: AgentConsoleState;
  events: EventsColumn;
}) {
  const unseen = useUnseenCount(state.feed.events, !events.collapsed);
  return (
    <div
      className={cn(
        'grid h-full min-h-0 gap-3',
        events.collapsed
          ? 'grid-cols-[20rem_minmax(0,1fr)_auto] 2xl:grid-cols-[24rem_minmax(0,1fr)_auto]'
          : 'grid-cols-[20rem_minmax(0,1fr)_18rem] 2xl:grid-cols-[24rem_minmax(0,1fr)_22rem]',
      )}
    >
      <div className={COLUMN}>{panels[ConsoleTab.Chat]}</div>
      <div className={COLUMN}>{panels[ConsoleTab.Map]}</div>
      {events.collapsed ? (
        <EventsRail unseen={unseen} onShow={() => events.setCollapsed(false)} />
      ) : (
        <div id={EVENTS_COLUMN_ID} className={COLUMN}>
          {panels[ConsoleTab.Events]}
        </div>
      )}
    </div>
  );
}
