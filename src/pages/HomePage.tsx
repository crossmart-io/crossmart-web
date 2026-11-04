import { useSession } from '@/features/auth';
import { SystemStatusCard } from '@/features/system-status';
import { useCurrentWorkspace } from '@/features/workspaces';

export function HomePage() {
  const { data: session } = useSession();
  const { workspace } = useCurrentWorkspace();

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Welcome{session ? `, ${session.user.name}` : ''}
        </h1>
        <p className="text-muted-foreground">
          {workspace ? `You are working in ${workspace.name}.` : 'Loading your workspace…'}
        </p>
      </div>
      <SystemStatusCard />
    </section>
  );
}
