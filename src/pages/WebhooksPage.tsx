import { WorkspacePermission } from '@/api/schema';
import { PermissionGate } from '@/components/feedback/PermissionGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { CreateWebhookEndpointButton, WEBHOOK_COPY, WebhookEndpoints } from '@/features/webhooks';
import { hasPermission, useCurrentWorkspace } from '@/features/workspaces';

export function WebhooksPage() {
  const { workspace } = useCurrentWorkspace();
  const canManage = workspace && hasPermission(workspace, WorkspacePermission.webhooks_manage);

  return (
    <Page
      name="Webhooks"
      parents={PAGE_PARENTS.settings}
      description={WEBHOOK_COPY.pageDescription}
      actions={canManage && <CreateWebhookEndpointButton workspaceId={workspace.id} />}
    >
      <PermissionGate
        permission={WorkspacePermission.webhooks_manage}
        denied={WEBHOOK_COPY.noAccess}
      >
        {(current) => <WebhookEndpoints workspaceId={current.id} />}
      </PermissionGate>
    </Page>
  );
}
