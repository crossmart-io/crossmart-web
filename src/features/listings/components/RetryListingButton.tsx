import { RotateCcw } from 'lucide-react';
import { Link } from 'react-router';
import { toApiErrorMessage } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ROUTES, toChannelConnectionRoute } from '@/config/routes';
import { type ProductChannelRef, useRetryListing } from '../hooks/useProductChannels';
import { RETRY_COPY, RetryFailure } from '../listings.constants';
import { retryFailureOf } from '../retry-failure';

/** Where a failure is dealt with, when it has such a place: the plan, or reconnecting. */
function failureLink(failure: RetryFailure, connectionId: string) {
  if (failure === RetryFailure.PlanFull) return { to: ROUTES.plan, label: RETRY_COPY.planLink };
  if (failure === RetryFailure.StoreNotConnected) {
    return { to: toChannelConnectionRoute(connectionId), label: RETRY_COPY.reconnectLink };
  }
  return null;
}

/** Why the retry did not go through, in words the merchant can act on, and where to act. */
function RetryError({ error, connectionId }: { error: Error; connectionId: string }) {
  const failure = retryFailureOf(error);
  const message =
    failure === RetryFailure.Other ? toApiErrorMessage(error) : RETRY_COPY.failures[failure];
  const link = failureLink(failure, connectionId);
  return (
    <p role="alert" className="text-xs text-destructive">
      {message}
      {link && (
        <>
          {' '}
          <Link to={link.to} className="font-medium underline">
            {link.label}
          </Link>
        </>
      )}
    </p>
  );
}

/**
 * Publishes one product to one store again, in place: a spinner while the request is out, then
 * the row turns "Publishing" and updates itself as the lists refetch.
 */
export function RetryListingButton({ listing }: { listing: ProductChannelRef }) {
  const retry = useRetryListing(listing);
  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        type="button"
        variant="outline"
        size="xs"
        disabled={retry.isPending}
        onClick={() => retry.mutate()}
      >
        {retry.isPending ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <RotateCcw data-icon="inline-start" />
        )}
        {retry.isPending ? RETRY_COPY.pending : RETRY_COPY.action}
      </Button>
      {retry.error && <RetryError error={retry.error} connectionId={listing.connectionId} />}
    </div>
  );
}
