import { Link } from 'react-router';
import { AgentWorkerContextView, ChannelConnectionStatus } from '@/api/schema';
import {
  AGENT_WORKER_COPY,
  AGENT_WORKER_TEST_IDS,
  AskAgentWorkerButton,
} from '@/features/agent-worker';
import { ConnectionStatusBadge } from '@/features/channels';
import { StoreName } from '@/features/listings';
import type { StoreListingHealth } from '@/features/listing-health/listing-health.types';
import { cn } from '@/lib/utils';
import {
  CHANNEL_MAP_COPY,
  MAP_STATUS_ORDER,
  MAP_STATUS_PRESENTATION,
  MapStatus,
} from '../channel-map.constants';
import type { StoreNodeData } from '../channel-map.types';
import { storeListingsRoute } from '../store-routes';
import { LastSynced } from './LastSynced';
import { NodeOverlayFrame } from './NodeOverlayFrame';

const FOCUS_RING =
  'rounded-md focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none';

/** One status the store has products in, as a link to them: "3 live". */
function StatusCountChip({
  store,
  status,
  count,
  separated,
}: {
  store: StoreListingHealth;
  status: MapStatus;
  count: number;
  /** Set apart from the count before it. */
  separated: boolean;
}) {
  const { label, countLabel, icon: Icon, iconClass } = MAP_STATUS_PRESENTATION[status];
  return (
    <li className="flex items-center gap-1">
      {separated && (
        <span className="text-muted-foreground" aria-hidden="true">
          {CHANNEL_MAP_COPY.countSeparator}
        </span>
      )}
      <Link
        to={storeListingsRoute(store.connectionId, status)}
        aria-label={CHANNEL_MAP_COPY.statusCount(store.displayName, label, count)}
        data-status={status}
        className={cn(
          'flex items-center gap-1 px-0.5 whitespace-nowrap transition-colors hover:bg-accent',
          FOCUS_RING,
        )}
      >
        <Icon className={cn('size-3', iconClass)} aria-hidden="true" />
        <span className="font-medium tabular-nums">{count.toLocaleString()}</span>
        <span className="text-muted-foreground">{countLabel}</span>
      </Link>
    </li>
  );
}

/** The statuses the store has products in, or one muted line when it has none. */
function StatusCounts({ store, counts }: StoreNodeData) {
  const present = MAP_STATUS_ORDER.filter((status) => counts[status] > 0);
  if (present.length === 0) {
    return <p className="text-xs text-muted-foreground">{CHANNEL_MAP_COPY.nothingListed}</p>;
  }
  return (
    <ul className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs">
      {present.map((status, index) => (
        <StatusCountChip
          key={status}
          store={store}
          status={status}
          count={counts[status]}
          separated={index > 0}
        />
      ))}
    </ul>
  );
}

/** For a store with failed listings: Crossmart Agent, ready to fix them (the person presses send). */
function FixWithAgentWorker({ store }: { store: StoreListingHealth }) {
  return (
    <AskAgentWorkerButton
      label={AGENT_WORKER_COPY.fixStore}
      context={{ view: AgentWorkerContextView.channel_map, connectionId: store.connectionId }}
      prefill={AGENT_WORKER_COPY.fixStorePrompt(store.displayName)}
      variant="ghost"
      size="xs"
      className="-me-1.5"
      testId={AGENT_WORKER_TEST_IDS.storeFixButton}
    />
  );
}

/**
 * A store on the account's map: its name (opening its listings), its connection when it is not
 * connected, how many products are in each status it has (each opening those products), and when
 * it last synced; with failed listings, a way to have Crossmart Agent fix them. A live view lays the
 * agent's work over it.
 */
export function StoreCard({ store, counts, overlay }: StoreNodeData) {
  return (
    <NodeOverlayFrame overlay={overlay}>
      <StoreCardBody store={store} counts={counts} />
    </NodeOverlayFrame>
  );
}

function StoreCardBody({ store, counts }: StoreNodeData) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card p-3 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between gap-2 text-sm">
        <Link
          to={storeListingsRoute(store.connectionId)}
          aria-label={CHANNEL_MAP_COPY.openStore(store.displayName)}
          className={cn('min-w-0 hover:underline', FOCUS_RING)}
        >
          <StoreName connection={store} />
        </Link>
        {store.status !== ChannelConnectionStatus.CONNECTED && (
          <ConnectionStatusBadge status={store.status} />
        )}
      </div>
      <StatusCounts store={store} counts={counts} />
      <div className="flex min-h-6 flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <LastSynced value={store.lastSyncedAt} />
        {counts[MapStatus.Failed] > 0 && <FixWithAgentWorker store={store} />}
      </div>
    </div>
  );
}
