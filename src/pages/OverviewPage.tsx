import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { useApiKeys } from '@/features/api-keys';
import { useSession } from '@/features/auth';
import { useCatalogStats } from '@/features/catalog';
import { useChannelSetup } from '@/features/channels';
import { InventoryOverview } from '@/features/inventory-report';
import { CatalogHealth, CatalogStatsGrid, GettingStarted } from '@/features/overview';
import { SalesOverview } from '@/features/sales';
import type { Workspace } from '@/features/workspaces';

function OverviewContent({ workspace }: { workspace: Workspace }) {
  const { data: stats } = useCatalogStats(workspace.id);
  const { data: apiKeys } = useApiKeys(workspace.id);
  const channelSetup = useChannelSetup(workspace.id);

  return (
    <>
      <SalesOverview workspaceId={workspace.id} />
      <InventoryOverview workspaceId={workspace.id} />
      <h2 className="font-heading text-lg font-semibold">Catalog</h2>
      <CatalogStatsGrid workspaceId={workspace.id} />
      <div className="grid gap-6 lg:grid-cols-2">
        <GettingStarted
          hasProducts={(stats?.products ?? 0) > 0}
          hasApiKey={(apiKeys?.length ?? 0) > 0}
          channelSetup={channelSetup}
        />
        <CatalogHealth workspaceId={workspace.id} />
      </div>
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
      <WorkspaceGate>{(workspace) => <OverviewContent workspace={workspace} />}</WorkspaceGate>
    </Page>
  );
}
