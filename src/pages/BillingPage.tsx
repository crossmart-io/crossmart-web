import { WorkspacePermission } from '@/api/schema';
import { PermissionGate } from '@/components/feedback/PermissionGate';
import { BILLING_COPY, BillingOverview } from '@/features/billing';

/** Settings › Billing: the plan, its billing and usage. */
export function BillingPage() {
  return (
    <PermissionGate permission={WorkspacePermission.billing_view} denied={BILLING_COPY.noAccess}>
      {(workspace) => <BillingOverview organizationId={workspace.organizationId} />}
    </PermissionGate>
  );
}
