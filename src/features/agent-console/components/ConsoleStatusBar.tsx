import type { ReactNode } from 'react';
import { RelativeTime } from '@/components/time/RelativeTime';
import { cn } from '@/lib/utils';
import { AGENT_CONSOLE_COPY, AGENT_CONSOLE_TEST_IDS, AgentState } from '../agent-console.constants';
import type { StoresStatus } from '../console-status';

const { status: COPY } = AGENT_CONSOLE_COPY;

const AGENT_DOT_CLASSES: Record<AgentState, string> = {
  [AgentState.Idle]: 'bg-muted-foreground/50',
  [AgentState.Running]: 'bg-brand motion-safe:animate-pulse',
  [AgentState.Waiting]: 'bg-warning',
  [AgentState.Unavailable]: 'bg-muted-foreground/30',
};

function StatusItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col">
      <dt className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</dt>
      {/* Figures wrap whole rather than being cut, so each count stays readable. */}
      <dd className="flex flex-wrap items-center gap-x-1.5 text-sm font-medium [&>span]:whitespace-nowrap">
        {children}
      </dd>
    </div>
  );
}

interface ConsoleStatusBarProps {
  stores: StoresStatus;
  agent: AgentState;
}

/** The workspace at a glance, above the map: stores, listings, the agent and the last sync. */
export function ConsoleStatusBar({ stores, agent }: ConsoleStatusBarProps) {
  return (
    <dl
      aria-label={COPY.label}
      data-testid={AGENT_CONSOLE_TEST_IDS.statusBar}
      className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg border bg-card px-3 py-2 @2xl:grid-cols-4"
    >
      <StatusItem label={COPY.stores}>{COPY.storesValue(stores.healthy, stores.total)}</StatusItem>
      <StatusItem label={COPY.listings}>
        {COPY.listingsValue(stores.liveListings)}
        {stores.failedListings > 0 && (
          <span className="text-destructive">· {COPY.failed(stores.failedListings)}</span>
        )}
        {stores.needsDetailsListings > 0 && (
          <span className="text-warning">· {COPY.needDetails(stores.needsDetailsListings)}</span>
        )}
      </StatusItem>
      <StatusItem label={COPY.agent}>
        <span
          className={cn('size-2 shrink-0 rounded-full', AGENT_DOT_CLASSES[agent])}
          aria-hidden="true"
        />
        {AGENT_CONSOLE_COPY.agentStates[agent]}
      </StatusItem>
      <StatusItem label={COPY.lastSync}>
        {stores.lastSyncedAt ? <RelativeTime value={stores.lastSyncedAt} /> : COPY.never}
      </StatusItem>
    </dl>
  );
}
