import { CircleCheck, CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ROUTES } from '@/config/routes';
import {
  BILLING_COPY,
  CHECKOUT_CONFIRMATION_POLL_MS,
  CHECKOUT_CONFIRMATION_TIMEOUT_MS,
} from '../billing.constants';
import { hasLiveSubscription } from '../billing';
import { useSubscriptionConfirmation } from '../hooks/useBillingStatus';

function BackToBilling() {
  return (
    <Button variant="outline" asChild>
      <Link to={ROUTES.billing}>{BILLING_COPY.backToBilling}</Link>
    </Button>
  );
}

/** True once `ms` has passed since the component mounted. */
function useTimedOut(ms: number): boolean {
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), ms);
    return () => window.clearTimeout(timer);
  }, [ms]);
  return timedOut;
}

function confirmationMessage(live: boolean, timedOut: boolean): string {
  if (live) return BILLING_COPY.checkoutSuccessDone;
  return timedOut ? BILLING_COPY.checkoutSuccessLate : BILLING_COPY.checkoutSuccessWaiting;
}

/**
 * Where checkout returns after paying: waits for the provider's webhook to confirm the
 * subscription, which usually takes seconds, then says so.
 */
export function CheckoutSuccess({ organizationId }: { organizationId: string }) {
  const timedOut = useTimedOut(CHECKOUT_CONFIRMATION_TIMEOUT_MS);
  const { data: status } = useSubscriptionConfirmation(
    organizationId,
    !timedOut && CHECKOUT_CONFIRMATION_POLL_MS,
  );
  const live = status !== undefined && hasLiveSubscription(status.status, status.hasBillingAccount);
  const message = confirmationMessage(live, timedOut);
  return (
    <Card className="max-w-xl">
      <CardContent className="flex flex-col items-start gap-4" aria-live="polite">
        {live ? <CircleCheck className="size-6 text-success" /> : <Spinner />}
        <p>{message}</p>
        <BackToBilling />
      </CardContent>
    </Card>
  );
}

/** Where checkout returns when the person backs out: nothing was charged. */
export function CheckoutCanceled() {
  return (
    <Card className="max-w-xl">
      <CardContent className="flex flex-col items-start gap-4">
        <CircleX className="size-6 text-muted-foreground" />
        <p>{BILLING_COPY.checkoutCanceledBody}</p>
        <BackToBilling />
      </CardContent>
    </Card>
  );
}
