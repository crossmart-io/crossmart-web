import { AccountChannelMap, type MapOverlay } from '@/features/channel-map';
import {
  AGENT_CONSOLE_COPY,
  AGENT_CONSOLE_TEST_IDS,
  type AgentState,
} from '../agent-console.constants';
import type { StoresStatus } from '../console-status';
import { ConsoleStatusBar } from './ConsoleStatusBar';

interface AgentMapPanelProps {
  workspaceId: string;
  overlay: MapOverlay;
  stores: StoresStatus;
  agent: AgentState;
}

/** The status bar over the live map of the catalog and its stores, with the agent's work on it. */
export function AgentMapPanel({ workspaceId, overlay, stores, agent }: AgentMapPanelProps) {
  return (
    <section
      aria-label={AGENT_CONSOLE_COPY.mapTitle}
      data-testid={AGENT_CONSOLE_TEST_IDS.map}
      className="@container flex h-full min-h-0 flex-col gap-3 p-3"
    >
      <ConsoleStatusBar stores={stores} agent={agent} />
      <div className="-me-1 min-h-0 flex-1 overflow-y-auto pt-1 pe-4 ps-1">
        <AccountChannelMap workspaceId={workspaceId} overlay={overlay} fill />
      </div>
    </section>
  );
}
