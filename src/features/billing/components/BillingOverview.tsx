import { ContentLoader } from '@/components/feedback/ContentLoader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { PlanUsage } from '@/features/plan';
import { useNow } from '@/hooks/useNow';
import { BILLING_COPY } from '../billing.constants';
import { useBillingStatus } from '../hooks/useBillingStatus';
import { BillingStatusCard } from './BillingStatusCard';
import { PlanPicker } from './PlanPicker';

/** The organization's plan and billing, the plans to choose from, and its usage. */
export function BillingOverview({ organizationId }: { organizationId: string }) {
  const { data: status, isError, error, refetch } = useBillingStatus(organizationId);
  const now = useNow();
  if (isError) return <ErrorState title={BILLING_COPY.loadError} error={error} onRetry={refetch} />;
  if (!status) return <ContentLoader />;
  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-3xl">
        <BillingStatusCard status={status} now={now} />
      </div>
      {status.enabled && <PlanPicker status={status} />}
      <div className="max-w-3xl">
        <PlanUsage organizationId={organizationId} />
      </div>
    </div>
  );
}
