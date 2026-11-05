import { WorkspacePermission } from '@/api/schema';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { PLAN_COPY, PlanUsage } from '@/features/plan';
import { hasPermission } from '@/features/workspaces';

export function PlanPage() {
  return (
    <Page
      name="Plan & usage"
      parents={PAGE_PARENTS.settings}
      description="Your organization's plan, what it includes, and how much of it is in use across all workspaces."
    >
      <WorkspaceGate>
        {(workspace) =>
          hasPermission(workspace, WorkspacePermission.billing_view) ? (
            <PlanUsage organizationId={workspace.organizationId} />
          ) : (
            <p className="text-sm text-muted-foreground">{PLAN_COPY.noAccess}</p>
          )
        }
      </WorkspaceGate>
    </Page>
  );
}
