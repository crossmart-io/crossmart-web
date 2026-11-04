import { WorkspacePermission } from '@/api/schema';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { hasPermission, useRoleCatalog, type Workspace } from '@/features/workspaces';
import { BuiltInRolesTable } from './BuiltInRolesTable';
import { CustomRolesTable } from './CustomRolesTable';

export function RolesOverview({ workspace }: { workspace: Workspace }) {
  const { data: catalog, error, refetch } = useRoleCatalog(workspace.id);

  if (error) {
    return <ErrorState title="Roles could not be loaded" error={error} onRetry={refetch} />;
  }
  if (!catalog) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">This workspace’s roles</h2>
        <CustomRolesTable
          workspace={workspace}
          roles={catalog.custom}
          canManage={hasPermission(workspace, WorkspacePermission.members_manage)}
        />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Built-in roles</h2>
        <BuiltInRolesTable roles={catalog.builtIn} />
      </section>
    </div>
  );
}
