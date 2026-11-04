import { Link } from 'react-router';
import { ListingStatus } from '@/api/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES, toChannelConnectionRoute } from '@/config/routes';
import { ConnectionStatusBadge } from '@/features/channels';
import { LISTING_STATUS_LABELS } from '@/features/listings';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { STORE_HEALTH_STATUSES } from '../inventory-report.constants';
import type { InventoryReport, StoreHealth } from '../inventory-report.types';

function listingSummary(store: StoreHealth): { status: ListingStatus; count: number }[] {
  const counts = new Map(store.listings.map((entry) => [entry.status, entry.count]));
  return STORE_HEALTH_STATUSES.map((status) => ({ status, count: counts.get(status) ?? 0 }));
}

function StoreRow({ store }: { store: StoreHealth }) {
  return (
    <li className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          to={toChannelConnectionRoute(store.connectionId)}
          className="truncate text-sm font-medium hover:underline"
        >
          {store.displayName}
        </Link>
        <ConnectionStatusBadge status={store.status} />
      </div>
      <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {listingSummary(store).map(({ status, count }) => (
          <span
            key={status}
            className={cn(
              status === ListingStatus.ERROR && count > 0 && 'font-medium text-destructive',
            )}
          >
            {count.toLocaleString()} {LISTING_STATUS_LABELS[status].toLowerCase()}
          </span>
        ))}
        <span>Synced {formatDateTime(store.lastSyncedAt, 'never')}</span>
      </p>
    </li>
  );
}

/** Each store's connection and its listings by status, so failures stand out. */
export function StoreHealthCard({ report }: { report: InventoryReport }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stores</CardTitle>
        <CardDescription>Connections and listings on each store.</CardDescription>
      </CardHeader>
      <CardContent>
        {report.stores.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            <Link to={ROUTES.channels} className="font-medium text-foreground underline">
              Connect a store
            </Link>{' '}
            to list your products on it.
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {report.stores.map((store) => (
              <StoreRow key={store.connectionId} store={store} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
