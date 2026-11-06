import { CircleCheck } from 'lucide-react';
import { Link } from 'react-router';
import { ChannelConnectionStatus } from '@/api/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toProductRoute } from '@/config/routes';
import { ListingIssue, ListingStateBadge, listingFixOf } from '@/features/listings';
import { LISTING_HEALTH_COPY } from '../listing-health.constants';
import type {
  ListingHealthReport,
  StoreListingFailure,
  StoreListingHealth,
} from '../listing-health.types';

interface FailureRowProps {
  failure: StoreListingFailure;
  store: StoreListingHealth | undefined;
  workspaceId: string;
  canEdit: boolean;
}

/** One refused listing: the product and store, the channel's reason, and the way to fix it. */
function FailureRow({ failure, store, workspaceId, canEdit }: FailureRowProps) {
  return (
    <li className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <Link
            to={toProductRoute(failure.productId)}
            className="truncate text-sm font-medium hover:underline"
            title={failure.productTitle}
          >
            {failure.productTitle}
          </Link>
          {store && (
            <span className="truncate text-xs text-muted-foreground">{store.displayName}</span>
          )}
        </div>
        <ListingStateBadge state={failure.displayState} />
      </div>
      <ListingIssue
        state={failure.displayState}
        reason={failure.displayReason}
        fix={listingFixOf(failure)}
        listing={{ workspaceId, productId: failure.productId, connectionId: failure.connectionId }}
        canEdit={canEdit}
        canRetry={store?.status === ChannelConnectionStatus.CONNECTED}
      />
    </li>
  );
}

interface RecentFailuresCardProps {
  report: ListingHealthReport;
  workspaceId: string;
  /** Whether the member may retry listings. */
  canEdit: boolean;
}

/** The latest listings the stores refused, each with why and the way to fix it. */
export function RecentFailuresCard({ report, workspaceId, canEdit }: RecentFailuresCardProps) {
  const stores = new Map(report.stores.map((store) => [store.connectionId, store]));
  const { recentFailures, failedListings } = report;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{LISTING_HEALTH_COPY.failuresTitle}</CardTitle>
        <CardDescription>{LISTING_HEALTH_COPY.failuresDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {recentFailures.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CircleCheck className="size-4 text-success" aria-hidden="true" />
            {LISTING_HEALTH_COPY.noFailures}
          </p>
        ) : (
          <>
            <ul className="flex flex-col divide-y">
              {recentFailures.map((failure) => (
                <FailureRow
                  key={failure.id}
                  failure={failure}
                  store={stores.get(failure.connectionId)}
                  workspaceId={workspaceId}
                  canEdit={canEdit}
                />
              ))}
            </ul>
            {failedListings > recentFailures.length && (
              <p className="mt-3 text-xs text-muted-foreground">
                {LISTING_HEALTH_COPY.moreFailures(failedListings)}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
