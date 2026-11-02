import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { useSession } from '@/features/auth';
import { useCatalogStats } from '@/features/catalog';
import { CatalogStatsGrid, GettingStarted } from '@/features/overview';
import { SystemStatusCard } from '@/features/system-status';
import type { Workspace } from '@/features/workspaces';

function Overview({ workspace }: { workspace: Workspace }) {
  const { data: session } = useSession();
  const { data: stats } = useCatalogStats(workspace.id);
  const firstName = session?.user.name.split(' ')[0];

  return (
    <>
      <PageHeader
        title={firstName ? `Welcome, ${firstName}` : 'Overview'}
        description={`Here is how ${workspace.name} is doing.`}
        actions={
          <Button asChild>
            <Link to={ROUTES.newProduct}>
              <Plus />
              Add product
            </Link>
          </Button>
        }
      />
      <div className="flex flex-col gap-6">
        <CatalogStatsGrid workspaceId={workspace.id} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <GettingStarted hasProducts={(stats?.products ?? 0) > 0} />
          <SystemStatusCard />
        </div>
      </div>
    </>
  );
}

export function OverviewPage() {
  return <WorkspaceGate>{(workspace) => <Overview workspace={workspace} />}</WorkspaceGate>;
}
