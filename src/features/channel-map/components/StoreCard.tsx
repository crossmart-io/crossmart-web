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

const FOCUS_RING =
  'rounded-md focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none';

/** One status of the store, as a link to its products in that status. */
function StatusCountLink({
  store,
  status,
  count,
}: {
  store: StoreListingHealth;
  status: MapStatus;
  count: number;
}) {
  const { label, icon: Icon, iconClass } = MAP_STATUS_PRESENTATION[status];
  return (
    <li>
      <Link
        to={storeListingsRoute(store.connectionId, status)}
        aria-label={CHANNEL_MAP_COPY.statusCount(store.displayName, label, count)}
        data-status={status}
        className={cn(
          'flex flex-col gap-0.5 px-1.5 py-1 transition-colors hover:bg-accent',
          FOCUS_RING,
          count === 0 && 'opacity-60',
        )}
      >
        <span className="text-base leading-none font-semibold tabular-nums">
          {count.toLocaleString()}
        </span>
        <span className="flex items-center gap-1 text-xs whitespace-nowrap text-muted-foreground">
          <Icon className={cn('size-3', iconClass)} aria-hidden="true" />
          {label}
        </span>
      </Link>
    </li>
  );
}

/** For a store with failed listings: Agent Worker, ready to fix them (the person presses send). */
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
 * connected, how many products are in each status (each opening those products), and when it
 * last synced; with failed listings, a way to have Agent Worker fix them.
 */
export function StoreCard({ store, counts }: StoreNodeData) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border bg-card p-3 text-card-foreground shadow-sm">
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
      <ul className="grid grid-cols-4 gap-1">
        {MAP_STATUS_ORDER.map((status) => (
          <StatusCountLink key={status} store={store} status={status} count={counts[status]} />
        ))}
      </ul>
      <div className="flex min-h-6 items-center justify-between gap-2">
        <LastSynced value={store.lastSyncedAt} />
        {counts[MapStatus.Failed] > 0 && <FixWithAgentWorker store={store} />}
      </div>
    </div>
  );
}
