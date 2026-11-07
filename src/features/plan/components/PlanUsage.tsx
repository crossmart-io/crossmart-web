import { ContentLoader } from '@/components/feedback/ContentLoader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useSubscription } from '../hooks/useSubscription';
import { PLAN_COPY } from '../plan.constants';
import { PlanFeatureList } from './PlanFeatureList';
import { UsageMeterList } from './UsageMeterList';

/** A meter per limit of the organization's plan, and its features. */
export function PlanUsage({ organizationId }: { organizationId: string }) {
  const { data: subscription, isError, error, refetch } = useSubscription(organizationId);
  if (isError) return <ErrorState title={PLAN_COPY.loadError} error={error} onRetry={refetch} />;
  if (!subscription) return <ContentLoader />;
  return (
    <div className="flex flex-col gap-6">
      <UsageMeterList features={subscription.features} />
      <PlanFeatureList features={subscription.features} />
    </div>
  );
}
