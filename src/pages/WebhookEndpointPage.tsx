import { useNavigate, useParams } from 'react-router';
import { WorkspacePermission } from '@/api/schema';
import { PermissionGate } from '@/components/feedback/PermissionGate';
import { Page } from '@/components/layout/Page';
import { type ResourcePageCopy, ResourcePage } from '@/components/layout/ResourcePage';
import { PAGE_PARENTS } from '@/config/navigation';
import { ROUTE_PARAMS, ROUTES } from '@/config/routes';
import {
  DeliveryLog,
  EndpointActionsMenu,
  EndpointOverview,
  SendTestEventButton,
  useWebhookEndpoint,
  WEBHOOK_COPY,
  type WebhookEndpointRef,
} from '@/features/webhooks';

const ENDPOINT_PAGE_COPY: ResourcePageCopy = {
  name: 'Webhook endpoint',
  notFoundName: 'Endpoint not found',
  notFound: 'This webhook endpoint does not exist in this workspace.',
  loadFailed: 'This endpoint could not be loaded',
};

function WebhookEndpoint({ endpointRef }: { endpointRef: WebhookEndpointRef }) {
  const query = useWebhookEndpoint(endpointRef);
  const navigate = useNavigate();
  return (
    <ResourcePage query={query} copy={ENDPOINT_PAGE_COPY} parents={PAGE_PARENTS.webhooks}>
      {(endpoint) => (
        <Page
          name={endpoint.url}
          parents={PAGE_PARENTS.webhooks}
          title={<span className="min-w-0 font-mono break-all">{endpoint.url}</span>}
          description={endpoint.description}
          actions={
            <>
              <SendTestEventButton endpointRef={endpointRef} />
              <EndpointActionsMenu
                workspaceId={endpointRef.workspaceId}
                endpoint={endpoint}
                onDeleted={() => void navigate(ROUTES.webhooks)}
              />
            </>
          }
        >
          <EndpointOverview endpoint={endpoint} />
          <DeliveryLog endpointRef={endpointRef} />
        </Page>
      )}
    </ResourcePage>
  );
}

export function WebhookEndpointPage() {
  const endpointId = useParams()[ROUTE_PARAMS.endpointId] ?? '';
  return (
    <PermissionGate permission={WorkspacePermission.webhooks_manage} denied={WEBHOOK_COPY.noAccess}>
      {(workspace) => <WebhookEndpoint endpointRef={{ workspaceId: workspace.id, endpointId }} />}
    </PermissionGate>
  );
}
