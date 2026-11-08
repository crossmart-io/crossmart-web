import { ConsoleTab } from '../agent-console.constants';
import type { ConsolePanels } from './AgentConsole';

const COLUMN = 'min-h-0 overflow-hidden rounded-xl border bg-background';

/** Chat, map and events in three columns, each scrolling on its own. */
export function ConsoleColumns({ panels }: { panels: ConsolePanels }) {
  return (
    <div className="grid h-full min-h-0 grid-cols-[20rem_minmax(0,1fr)_18rem] gap-3 2xl:grid-cols-[24rem_minmax(0,1fr)_22rem]">
      <div className={COLUMN}>{panels[ConsoleTab.Chat]}</div>
      <div className={COLUMN}>{panels[ConsoleTab.Map]}</div>
      <div className={COLUMN}>{panels[ConsoleTab.Events]}</div>
    </div>
  );
}
