import { SubscriptionStatus } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PLAN_COPY, SUBSCRIPTION_STATUS_LABELS } from '../plan.constants';
import type { Subscription } from '../plan.types';
import { UpgradeButton } from './UpgradeButton';

/** The plan the organization is on, its status, and whether its limits block anything yet. */
export function PlanSummaryCard({ subscription }: { subscription: Subscription }) {
  const { plan, status, enforced } = subscription;
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Current plan</p>
          <div className="flex items-center gap-2">
            <p className="font-heading text-2xl font-semibold tracking-tight">{plan.name}</p>
            <Badge variant={status === SubscriptionStatus.ACTIVE ? 'success' : 'warning'}>
              {SUBSCRIPTION_STATUS_LABELS[status]}
            </Badge>
          </div>
          <p className="max-w-prose text-xs text-muted-foreground">
            {enforced ? PLAN_COPY.enforced : PLAN_COPY.notEnforced}
          </p>
        </div>
        <UpgradeButton />
      </CardContent>
    </Card>
  );
}
