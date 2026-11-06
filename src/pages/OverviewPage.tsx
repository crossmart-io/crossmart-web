import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { ContentLoader } from '@/components/feedback/ContentLoader';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { useSession } from '@/features/auth';
import { InventoryOverview } from '@/features/inventory-report';
import { useHasOrders } from '@/features/orders';
import {
  CatalogHealth,
  CatalogStatsGrid,
  GettingStarted,
  type OnboardingState,
  SalesEmptyState,
  useOnboarding,
} from '@/features/overview';
import { SalesOverview } from '@/features/sales';

interface OverviewSectionProps {
  workspaceId: string;
}

/** The checklist and the catalog's gaps: first until setup is done, last after. */
function SetupSection({
  workspaceId,
  onboarding,
}: OverviewSectionProps & { onboarding: OnboardingState }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GettingStarted {...onboarding} />
      <CatalogHealth workspaceId={workspaceId} />
    </div>
  );
}

/**
 * A new seller sees what to do next first, and one quiet note instead of empty charts. Once orders
 * come in and setup is done, the page reads as a sales dashboard.
 */
function OverviewContent({ workspaceId }: OverviewSectionProps) {
  const { state: onboarding, isComplete } = useOnboarding(workspaceId);
  const hasOrders = useHasOrders(workspaceId);
  if (isComplete === undefined || hasOrders === undefined) return <ContentLoader />;

  const setup = <SetupSection workspaceId={workspaceId} onboarding={onboarding} />;
  return (
    <>
      {!isComplete && setup}
      {hasOrders ? <SalesOverview workspaceId={workspaceId} /> : <SalesEmptyState />}
      {onboarding.hasProducts && <InventoryOverview workspaceId={workspaceId} />}
      <h2 className="font-heading text-lg font-semibold">Catalog</h2>
      <CatalogStatsGrid workspaceId={workspaceId} />
      {isComplete && setup}
    </>
  );
}

export function OverviewPage() {
  const { data: session } = useSession();
  const firstName = session?.user.name.split(' ')[0];

  return (
    <Page
      name="Overview"
      title={firstName ? `Welcome, ${firstName}` : 'Overview'}
      description="Your sales, stock and catalog at a glance, and what to do next."
      actions={
        <Button asChild>
          <Link to={ROUTES.newProduct}>
            <Plus data-icon="inline-start" />
            Add product
          </Link>
        </Button>
      }
    >
      <WorkspaceGate>{(workspace) => <OverviewContent workspaceId={workspace.id} />}</WorkspaceGate>
    </Page>
  );
}
