import { useState } from 'react';
import { BillingInterval } from '@/api/schema';
import { ContentLoader } from '@/components/feedback/ContentLoader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { BILLING_COPY } from '../billing.constants';
import { hasLiveSubscription } from '../billing';
import type { BillingPlan, BillingStatus } from '../billing.types';
import { useBillingPlans } from '../hooks/useBillingPlans';
import { useStartCheckout } from '../hooks/useHostedBillingPage';
import { IntervalToggle } from './IntervalToggle';
import { PlanAction } from './PlanAction';
import { PlanCard } from './PlanCard';

/** The plan lineup with a monthly/annual toggle; choosing a plan starts checkout. */
export function PlanPicker({ status }: { status: BillingStatus }) {
  const [interval, setInterval] = useState<BillingInterval>(BillingInterval.MONTHLY);
  const { data: catalog, isError, error, refetch } = useBillingPlans();
  const checkout = useStartCheckout(status.organizationId);
  const subscribed = hasLiveSubscription(status.status, status.hasBillingAccount);

  if (isError)
    return <ErrorState title={BILLING_COPY.plansLoadError} error={error} onRetry={refetch} />;
  if (!catalog) return <ContentLoader />;

  const choose = (plan: BillingPlan) => checkout.mutate({ planCode: plan.code, interval });
  return (
    <section className="flex flex-col gap-4" aria-labelledby="plan-picker-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 id="plan-picker-title" className="font-heading text-lg font-semibold">
            {BILLING_COPY.choosePlan}
          </h2>
          {status.trialAvailable && (
            <p className="text-sm text-muted-foreground">{BILLING_COPY.choosePlanHint}</p>
          )}
        </div>
        <IntervalToggle value={interval} onChange={setInterval} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {catalog.plans.map((plan) => {
          const current = subscribed && plan.code === status.plan.code;
          return (
            <PlanCard
              key={plan.code}
              plan={plan}
              interval={interval}
              current={current}
              action={
                <PlanAction
                  plan={plan}
                  current={current}
                  subscribed={subscribed}
                  trialAvailable={status.trialAvailable}
                  salesEmail={catalog.salesEmail}
                  pending={checkout.isPending}
                  onChoose={choose}
                />
              }
            />
          );
        })}
      </div>
    </section>
  );
}
