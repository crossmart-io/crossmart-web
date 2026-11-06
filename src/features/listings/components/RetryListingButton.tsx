import { RotateCcw } from 'lucide-react';
import { Link } from 'react-router';
import { toApiErrorMessage } from '@/api/api-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ROUTES } from '@/config/routes';
import { type ProductChannelRef, useRetryListing } from '../hooks/useProductChannels';
import { RETRY_COPY, RetryFailure } from '../listings.constants';
import { retryFailureOf } from '../retry-failure';

/** Why the retry did not go through, in words the merchant can act on. */
function RetryError({ error }: { error: Error }) {
  const failure = retryFailureOf(error);
  const message =
    failure === RetryFailure.Other ? toApiErrorMessage(error) : RETRY_COPY.failures[failure];
  return (
    <p role="alert" className="text-xs text-destructive">
      {message}
      {failure === RetryFailure.PlanFull && (
        <>
          {' '}
          <Link to={ROUTES.plan} className="font-medium underline">
            {RETRY_COPY.planLink}
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
      {retry.error && <RetryError error={retry.error} />}
    </div>
  );
}
