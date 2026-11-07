import { WorkspacePermission } from '@/api/schema';
import { PermissionGate } from '@/components/feedback/PermissionGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { BILLING_COPY, CheckoutSuccess } from '@/features/billing';

export function CheckoutSuccessPage() {
  return (
    <Page name={BILLING_COPY.checkoutSuccessTitle} parents={PAGE_PARENTS.billing}>
      <PermissionGate permission={WorkspacePermission.billing_view} denied={BILLING_COPY.noAccess}>
        {(workspace) => <CheckoutSuccess organizationId={workspace.organizationId} />}
      </PermissionGate>
    </Page>
  );
}
