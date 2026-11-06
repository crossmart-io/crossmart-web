import { ErrorState } from '@/components/feedback/ErrorState';
import { ListSkeleton } from '@/components/lists/ListSkeleton';
import { useWebhookEndpoints } from '../hooks/useWebhookEndpoints';
import { WEBHOOK_COPY } from '../webhooks.constants';
import { WebhookEndpointsTable } from './WebhookEndpointsTable';
import { WebhooksEmptyState } from './WebhooksEmptyState';

/** Placeholder rows while the endpoints load; a workspace has only a few. */
const LOADING_ROWS = 3;

/** The workspace's endpoints, or what webhooks are when it has none. */
export function WebhookEndpoints({ workspaceId }: { workspaceId: string }) {
  const { data: endpoints, isPending, error, refetch } = useWebhookEndpoints(workspaceId);
  if (error) {
    return <ErrorState title={WEBHOOK_COPY.loadFailed} error={error} onRetry={refetch} />;
  }
  if (isPending) return <ListSkeleton label="Loading webhook endpoints" rows={LOADING_ROWS} />;
  if (endpoints.length === 0) return <WebhooksEmptyState workspaceId={workspaceId} />;
  return <WebhookEndpointsTable workspaceId={workspaceId} endpoints={endpoints} />;
}
