import { Link } from 'react-router';
import { ListingDisplayState } from '@/api/schema';
import { toStoreRoute } from '@/config/routes';
import { ConnectionStatusBadge } from '@/features/channels';
import { StoreName } from '@/features/listings';
import { formatDateTime } from '@/lib/format';
import { summarizeStore } from '../listing-health';
import { LISTING_HEALTH_COPY } from '../listing-health.constants';
import type { StoreListingHealth } from '../listing-health.types';
import { StoreStateBar } from './StoreStateBar';

/** One store: its connection, its products by state, and what is not in it. */
export function StoreHealthRow({ store }: { store: StoreListingHealth }) {
  const summary = summarizeStore(store);
  return (
    <li className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link to={toStoreRoute(store.connectionId)} className="min-w-0 text-sm hover:underline">
          <StoreName connection={store} />
        </Link>
        <ConnectionStatusBadge status={store.status} />
      </div>
      {store.statusReason && <p className="text-xs text-destructive">{store.statusReason}</p>}
      {summary.inStore > 0 ? (
        <StoreStateBar summary={summary} />
      ) : (
        <p className="text-xs text-muted-foreground">{LISTING_HEALTH_COPY.emptyStore}</p>
      )}
      <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>
          {LISTING_HEALTH_COPY.outOfStore(
            summary.counts[ListingDisplayState.draft] ?? 0,
            summary.counts[ListingDisplayState.removed] ?? 0,
          )}
        </span>
        <span>
          {LISTING_HEALTH_COPY.synced}{' '}
          {formatDateTime(store.lastSyncedAt, LISTING_HEALTH_COPY.neverSynced)}
        </span>
      </p>
    </li>
  );
}
