import { History, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { ContentLoader } from '@/components/feedback/ContentLoader';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { NeedsAttention } from '@/features/attention';
import { useSession } from '@/features/auth';
import { useHasOrders } from '@/features/orders';
import { GettingStarted, SalesEmptyState, useOnboarding } from '@/features/overview';
import { SalesOverview } from '@/features/sales';
import type { Workspace } from '@/features/workspaces';

/**
 * What needs the seller first, then the first steps while setup is unfinished, then sales.
 * Stock value lives on Products › Stock, and listing problems in the list at the top.
 */
function OverviewContent({ workspace }: { workspace: Workspace }) {
  const { state: onboarding, isComplete } = useOnboarding(workspace.id);
  const hasOrders = useHasOrders(workspace.id);
  if (isComplete === undefined || hasOrders === undefined) return <ContentLoader />;
  return (
    <>
      <NeedsAttention workspaceId={workspace.id} />
      {!isComplete && <GettingStarted {...onboarding} />}
      {hasOrders ? <SalesOverview workspaceId={workspace.id} /> : <SalesEmptyState />}
    </>
  );
}

function HomeActions() {
  return (
    <>
      <Button variant="outline" asChild>
        <Link to={ROUTES.activity}>
          <History data-icon="inline-start" />
          Activity
        </Link>
      </Button>
      <Button asChild>
        <Link to={ROUTES.newProduct}>
          <Plus data-icon="inline-start" />
          Add product
        </Link>
      </Button>
    </>
  );
}

/** Home: what needs attention, the first steps, and sales. */
export function OverviewPage() {
  const { data: session } = useSession();
  const firstName = session?.user.name.split(' ')[0];

  return (
    <Page
      name="Home"
      title={firstName ? `Welcome, ${firstName}` : 'Home'}
      actions={<HomeActions />}
    >
      <WorkspaceGate>{(workspace) => <OverviewContent workspace={workspace} />}</WorkspaceGate>
    </Page>
  );
}
