import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import type { BillingInterval } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatGrant, meteredFeatures } from '@/features/plan';
import { formatMinorUnits } from '@/lib/format';
import { BILLING_COPY, INTERVAL_BILLING_NOTES } from '../billing.constants';
import { priceOf } from '../billing';
import type { BillingPlan } from '../billing.types';

interface PlanCardProps {
  plan: BillingPlan;
  interval: BillingInterval;
  current: boolean;
  /** The plan's call to action: subscribe, contact sales, or the current plan. */
  action: ReactNode;
}

function PlanPriceLine({ plan, interval }: { plan: BillingPlan; interval: BillingInterval }) {
  const price = priceOf(plan, interval);
  if (!price) {
    return <p className="text-sm text-muted-foreground">{BILLING_COPY.enterpriseNote}</p>;
  }
  return (
    <div className="flex flex-col">
      <p>
        <span className="font-heading text-3xl font-semibold tracking-tight">
          {formatMinorUnits(price.monthlyAmount, price.currency)}
        </span>{' '}
        <span className="text-sm text-muted-foreground">{BILLING_COPY.perMonth}</span>
      </p>
      <span className="text-xs text-muted-foreground">
        {INTERVAL_BILLING_NOTES[interval]} · {formatMinorUnits(price.amount, price.currency)}
      </span>
    </div>
  );
}

/** One plan of the lineup: its price for the interval, its limits, and what to do about it. */
export function PlanCard({ plan, interval, current, action }: PlanCardProps) {
  return (
    <Card className={current ? 'ring-2 ring-primary' : undefined}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {plan.name}
          {current && <Badge variant="secondary">{BILLING_COPY.currentPlanButton}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <PlanPriceLine plan={plan} interval={interval} />
        <ul className="flex flex-col gap-2 text-sm">
          {meteredFeatures(plan.features).map((grant) => (
            <li key={grant.feature} className="flex items-start gap-2">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
              {formatGrant(grant)}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">{action}</CardFooter>
    </Card>
  );
}
