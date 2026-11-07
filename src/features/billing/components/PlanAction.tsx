import { Button } from '@/components/ui/button';
import { BILLING_COPY } from '../billing.constants';
import type { BillingPlan } from '../billing.types';

interface PlanActionProps {
  plan: BillingPlan;
  current: boolean;
  /** The organization already pays; plan changes go through the billing portal. */
  subscribed: boolean;
  trialAvailable: boolean;
  salesEmail: string;
  pending: boolean;
  onChoose: (plan: BillingPlan) => void;
}

/** What a plan card offers: checkout, contacting sales, or a pointer to the billing portal. */
export function PlanAction(props: PlanActionProps) {
  const { plan, current, subscribed, trialAvailable, salesEmail, pending, onChoose } = props;
  if (!plan.selfServe) {
    return (
      <Button variant="outline" className="w-full" asChild>
        <a href={`mailto:${salesEmail}`}>{BILLING_COPY.contactSales}</a>
      </Button>
    );
  }
  if (subscribed) {
    return current ? null : (
      <p className="text-xs text-muted-foreground">{BILLING_COPY.changeInPortal}</p>
    );
  }
  return (
    <Button className="w-full" disabled={pending} onClick={() => onChoose(plan)}>
      {trialAvailable ? BILLING_COPY.startTrial : BILLING_COPY.subscribe}
    </Button>
  );
}
