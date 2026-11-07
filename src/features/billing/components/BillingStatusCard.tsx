import { SubscriptionAccessState } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, pluralize } from '@/lib/format';
import {
  BILLING_COPY,
  GOOD_STANDING_STATUSES,
  INTERVAL_LABELS,
  LIVE_STATUSES,
  SUBSCRIPTION_STATUS_LABELS,
} from '../billing.constants';
import { cancelledTrialNote, daysUntil } from '../billing';
import type { BillingStatus } from '../billing.types';
import { ManageBillingButton } from './ManageBillingButton';

/** When a scheduled cancellation ends the subscription; null when it renews. */
function scheduledEnd({ cancelAt, cancelAtPeriodEnd, currentPeriodEnd }: BillingStatus) {
  return cancelAt ?? (cancelAtPeriodEnd ? currentPeriodEnd : null);
}

/** When the subscription renews, ends, or leaves its trial, in one line; none once it ended. */
function periodNote(status: BillingStatus, now: Date): string | null {
  if (!LIVE_STATUSES.has(status.status)) return null;
  const { trialEnd, currentPeriodEnd } = status;
  const endsAt = scheduledEnd(status);
  if (status.access.state === SubscriptionAccessState.trialing && trialEnd) {
    if (endsAt) return cancelledTrialNote(endsAt);
    const left = pluralize(daysUntil(trialEnd, now), 'day');
    return `Trial ends in ${left}, on ${formatDate(trialEnd)}. Your card is charged then.`;
  }
  if (endsAt) return `Cancels on ${formatDate(endsAt)}.`;
  return currentPeriodEnd ? `Renews on ${formatDate(currentPeriodEnd)}.` : null;
}

/** The plan's name with its status, interval and legacy badges. */
function PlanHeading({ status }: { status: BillingStatus }) {
  const { plan, interval, enabled } = status;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="font-heading text-2xl font-semibold tracking-tight">{plan.name}</p>
      {enabled && (
        <Badge variant={GOOD_STANDING_STATUSES.has(status.status) ? 'success' : 'warning'}>
          {SUBSCRIPTION_STATUS_LABELS[status.status]}
        </Badge>
      )}
      {interval && <Badge variant="secondary">{INTERVAL_LABELS[interval]}</Badge>}
      {!plan.offered && <Badge variant="secondary">{BILLING_COPY.legacyPlan}</Badge>}
    </div>
  );
}

interface BillingStatusCardProps {
  status: BillingStatus;
  /** When the page was opened, for the trial countdown. */
  now: Date;
}

/** The organization's plan, its billing status and period, and the way to the billing portal. */
export function BillingStatusCard({ status, now }: BillingStatusCardProps) {
  const note = status.enabled ? periodNote(status, now) : BILLING_COPY.billingOff;
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{BILLING_COPY.currentPlan}</p>
          <PlanHeading status={status} />
          {!status.plan.offered && <p className="max-w-prose text-sm">{BILLING_COPY.legacyNote}</p>}
          {note && <p className="max-w-prose text-sm">{note}</p>}
          <p className="max-w-prose text-xs text-muted-foreground">
            {status.access.enforced ? BILLING_COPY.limitsEnforced : BILLING_COPY.limitsNotEnforced}
          </p>
        </div>
        {status.hasBillingAccount && (
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <ManageBillingButton organizationId={status.organizationId} />
            <span className="max-w-56 text-xs text-muted-foreground sm:text-right">
              {BILLING_COPY.manageBillingHint}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
