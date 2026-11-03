import { ExternalLink, Share2 } from 'lucide-react';
import { Link } from 'react-router';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { LoadMoreButton } from '@/components/lists/LoadMoreButton';
import { RelativeTime } from '@/components/time/RelativeTime';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useReturnToState } from '@/components/navigation/return-to';
import { toProductRoute } from '@/config/routes';
import { ProductThumbnail } from '@/features/catalog';
import type { useChannelListings } from '../hooks/useChannelListings';
import type { ChannelListing } from '../listings.types';
import { ListingStatusBadge } from './ListingStatusBadge';

const LISTINGS_SKELETON_ROWS = 5;

function ListingRow({ listing }: { listing: ChannelListing }) {
  const returnTo = useReturnToState();
  return (
    <TableRow className="align-top">
      <TableCell>
        <div className="flex min-w-0 items-center gap-3">
          <ProductThumbnail url={listing.imageUrl} alt="" className="size-8" />
          <div className="flex min-w-0 flex-col">
            <Link
              to={toProductRoute(listing.productId)}
              state={returnTo}
              className="truncate font-medium hover:underline"
            >
              {listing.productTitle}
            </Link>
            {listing.lastError && (
              <span className="line-clamp-2 text-xs text-destructive" title={listing.lastError}>
                {listing.lastError}
              </span>
            )}
            <span className="text-xs text-muted-foreground sm:hidden">
              {listing.lastSyncedAt ? (
                <RelativeTime value={listing.lastSyncedAt} />
              ) : (
                'Not synced yet'
              )}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <ListingStatusBadge status={listing.status} />
      </TableCell>
      <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
        {listing.lastSyncedAt ? <RelativeTime value={listing.lastSyncedAt} /> : 'Not yet'}
      </TableCell>
      <TableCell className="hidden w-10 sm:table-cell">
        {listing.externalUrl && (
          <a
            href={listing.externalUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${listing.productTitle} on the channel`}
            className="text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="size-4" />
          </a>
        )}
      </TableCell>
    </TableRow>
  );
}

function NoListings() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Share2 />
        </EmptyMedia>
        <EmptyTitle>Nothing listed yet</EmptyTitle>
        <EmptyDescription>
          Publish the selected products to list them on this channel.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

/** The connection's listings: where each product stands on the channel. */
export function ChannelListingsTable({
  listings,
}: {
  listings: ReturnType<typeof useChannelListings>;
}) {
  if (listings.isError) {
    return (
      <ErrorState
        title="Listings could not be loaded"
        error={listings.error}
        onRetry={listings.refetch}
      />
    );
  }
  if (listings.isPending)
    return <ListSkeleton label="Loading listings" rows={LISTINGS_SKELETON_ROWS} />;
  if (listings.listings.length === 0) return <NoListings />;
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="hidden w-40 sm:table-cell">Last synced</TableHead>
              <TableHead className="hidden w-10 sm:table-cell">
                <span className="sr-only">Open on the channel</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.listings.map((listing) => (
              <ListingRow key={listing.id} listing={listing} />
            ))}
          </TableBody>
        </Table>
      </div>
      {listings.hasNextPage && (
        <LoadMoreButton
          isLoading={listings.isFetchingNextPage}
          onLoadMore={() => void listings.fetchNextPage()}
        />
      )}
    </div>
  );
}
