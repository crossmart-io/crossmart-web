import { useParams } from 'react-router';
import { isNotFoundError } from '@/api/api-error';
import { ChannelConnectionStatus } from '@/api/schema';
import { ContentLoader } from '@/components/feedback/ContentLoader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { PAGE_PARENTS } from '@/config/navigation';
import { ROUTE_PARAMS } from '@/config/routes';
import { ConnectionStatusBadge } from '@/features/channels';
import {
  ChannelListingsCard,
  PricingRuleCard,
  ProductSelectionCard,
  useChannelConnection,
} from '@/features/listings';
import { canManageWorkspace, type Workspace } from '@/features/workspaces';

const CONNECTION_PAGE_NAME = 'Channel';

function ChannelConnection({
  workspace,
  connectionId,
}: {
  workspace: Workspace;
  connectionId: string;
}) {
  const {
    data: connection,
    isPending,
    error,
    refetch,
  } = useChannelConnection(workspace.id, connectionId);

  if (isNotFoundError(error)) {
    return (
      <Page name="Channel not found" parents={PAGE_PARENTS.channels}>
        <p className="text-muted-foreground">This connection does not exist or was removed.</p>
      </Page>
    );
  }
  if (error) {
    return (
      <Page name={CONNECTION_PAGE_NAME} parents={PAGE_PARENTS.channels}>
        <ErrorState title="This channel could not be loaded" error={error} onRetry={refetch} />
      </Page>
    );
  }
  if (isPending) return <ContentLoader />;

  const name = connection.shopify?.shopName ?? connection.displayName;
  const canManage = canManageWorkspace(workspace.role);
  const currency = connection.shopify?.currencyCode ?? workspace.currency;
  const ref = { workspaceId: workspace.id, connectionId };
  return (
    <Page
      name={name}
      parents={PAGE_PARENTS.channels}
      title={
        <>
          {name}
          <ConnectionStatusBadge status={connection.status} />
        </>
      }
      description={connection.externalAccountId}
    >
      <ChannelListingsCard
        {...ref}
        canManage={canManage}
        isConnected={connection.status === ChannelConnectionStatus.CONNECTED}
      />
      <PricingRuleCard
        {...ref}
        currency={currency}
        rule={connection.pricing}
        canManage={canManage}
      />
      <ProductSelectionCard {...ref} rule={connection.productSelection} canManage={canManage} />
    </Page>
  );
}

export function ChannelConnectionPage() {
  const connectionId = useParams()[ROUTE_PARAMS.connectionId] ?? '';
  return (
    <WorkspaceGate>
      {(workspace) => <ChannelConnection workspace={workspace} connectionId={connectionId} />}
    </WorkspaceGate>
  );
}
