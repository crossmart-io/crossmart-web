import { WorkspacePermission } from '@/api/schema';
import { PermissionGate } from '@/components/feedback/PermissionGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { BILLING_COPY, BillingOverview } from '@/features/billing';

export function BillingPage() {
  return (
    <Page
      name={BILLING_COPY.pageName}
      parents={PAGE_PARENTS.settings}
      description={BILLING_COPY.pageDescription}
    >
      <PermissionGate permission={WorkspacePermission.billing_view} denied={BILLING_COPY.noAccess}>
        {(workspace) => <BillingOverview organizationId={workspace.organizationId} />}
      </PermissionGate>
    </Page>
  );
}
