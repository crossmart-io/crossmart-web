import { WorkspacePermission } from '@/api/schema';
import { PermissionGate } from '@/components/feedback/PermissionGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { PLAN_COPY, PlanUsage } from '@/features/plan';

export function PlanPage() {
  return (
    <Page
      name="Plan & usage"
      parents={PAGE_PARENTS.settings}
      description="Your organization's plan, what it includes, and how much of it is in use across all workspaces."
    >
      <PermissionGate permission={WorkspacePermission.billing_view} denied={PLAN_COPY.noAccess}>
        {(workspace) => <PlanUsage organizationId={workspace.organizationId} />}
      </PermissionGate>
    </Page>
  );
}
