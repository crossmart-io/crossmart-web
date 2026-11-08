import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseEnum } from '@/lib/enum';
import { AGENT_CONSOLE_COPY, AGENT_CONSOLE_TEST_IDS, ConsoleTab } from '../agent-console.constants';
import type { AgentConsoleState } from '../hooks/useAgentConsole';
import { useUnseenCount } from '../hooks/useUnseenCount';
import { hasActivity } from '../map-overlay';
import type { ConsolePanels } from './AgentConsole';

const TAB_ORDER: readonly ConsoleTab[] = [ConsoleTab.Chat, ConsoleTab.Map, ConsoleTab.Events];

function UnseenBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ms-1 rounded-full bg-brand px-1.5 text-[11px] leading-4 font-semibold text-white tabular-nums">
      <span className="sr-only">, {AGENT_CONSOLE_COPY.newEvents(count)}</span>
      <span aria-hidden="true">{count}</span>
    </span>
  );
}

function ActivityDot({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span className="ms-1 size-2 rounded-full bg-brand motion-safe:animate-pulse">
      <span className="sr-only">, {AGENT_CONSOLE_COPY.mapActive}</span>
    </span>
  );
}

/** Chat, Map and Events as tabs: Events counts what arrived unseen, Map lights up as the agent works. */
export function ConsoleTabs({
  panels,
  state,
}: {
  panels: ConsolePanels;
  state: AgentConsoleState;
}) {
  const unseen = useUnseenCount(state.feed.events, state.tab === ConsoleTab.Events);
  const mapActive = state.tab !== ConsoleTab.Map && hasActivity(state.overlay);
  return (
    <Tabs
      value={state.tab}
      onValueChange={(value) => state.setTab(parseEnum(ConsoleTab, value) ?? ConsoleTab.Chat)}
      data-testid={AGENT_CONSOLE_TEST_IDS.tabs}
      className="h-full min-h-0 gap-3"
    >
      <TabsList className="w-full">
        {TAB_ORDER.map((tab) => (
          <TabsTrigger key={tab} value={tab} className="flex-1">
            {AGENT_CONSOLE_COPY.tabs[tab]}
            {tab === ConsoleTab.Events && <UnseenBadge count={unseen} />}
            {tab === ConsoleTab.Map && <ActivityDot active={mapActive} />}
          </TabsTrigger>
        ))}
      </TabsList>
      {TAB_ORDER.map((tab) => (
        <TabsContent
          key={tab}
          value={tab}
          forceMount
          className="min-h-0 flex-1 overflow-hidden rounded-xl border bg-background data-[state=inactive]:hidden"
        >
          {panels[tab]}
        </TabsContent>
      ))}
    </Tabs>
  );
}
