import { SystemStatusCard } from '@/features/system-status';

export function HomePage() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Welcome to Crossmart</h1>
        <p className="text-muted-foreground">
          The open-source multichannel platform for sellers and their AI agents.
        </p>
      </div>
      <SystemStatusCard />
    </section>
  );
}
