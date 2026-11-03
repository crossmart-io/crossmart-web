import { useNavigate, useParams } from 'react-router';
import { isNotFoundError } from '@/api/api-error';
import { ChannelConnectionStatus } from '@/api/schema';
import { ContentLoader } from '@/components/feedback/ContentLoader';
import { ErrorState } from '@/components/feedback/ErrorState';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { ReturnToProvider } from '@/components/navigation/ReturnToProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PAGE_PARENTS } from '@/config/navigation';
import { ROUTE_PARAMS, ROUTES, toChannelConnectionRoute } from '@/config/routes';
import {
  type ChannelConnection,
  ConnectionSettings,
  ConnectionStatusBadge,
  ConnectionSwitcher,
  connectionName,
} from '@/features/channels';
import {
  CHANNEL_TABS,
  ChannelProductsCard,
  ChannelSyncButton,
  ChannelTab,
  PricingRuleCard,
  ProductSelectionCard,
  toChannelTab,
  useChannelConnection,
} from '@/features/listings';
import { canEditCatalog, canManageWorkspace, type Workspace } from '@/features/workspaces';

const CONNECTION_PAGE_NAME = 'Channel';

interface ChannelConnectionTabsProps {
  workspace: Workspace;
  connection: ChannelConnection;
  tab: ChannelTab;
}

/** One tab per part of the connection; each tab has its own URL so it can be linked to. */
function ChannelConnectionTabs({ workspace, connection, tab }: ChannelConnectionTabsProps) {
  const navigate = useNavigate();
  const canManage = canManageWorkspace(workspace.role);
  const canEdit = canEditCatalog(workspace.role);
  const currency = connection.shopify?.currencyCode ?? workspace.currency;
  const ref = { workspaceId: workspace.id, connectionId: connection.id };
  return (
    <Tabs
      value={tab}
      onValueChange={(value) => void navigate(toChannelConnectionRoute(connection.id, value))}
      className="gap-6"
    >
      <TabsList variant="line" className="w-full justify-start border-b">
        {CHANNEL_TABS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger key={value} value={value} className="flex-none">
            <Icon data-icon="inline-start" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={ChannelTab.Listings}>
        <ChannelProductsCard {...ref} canEdit={canEdit} />
      </TabsContent>
      <TabsContent value={ChannelTab.Pricing}>
        <PricingRuleCard
          {...ref}
          currency={currency}
          rule={connection.pricing}
          canManage={canManage}
        />
      </TabsContent>
      <TabsContent value={ChannelTab.Settings}>
        <ConnectionSettings
          workspaceId={workspace.id}
          connection={connection}
          canManage={canManage}
          canEditCatalog={canEdit}
          onDisconnected={() => void navigate(ROUTES.channels)}
          automaticRule={
            <ProductSelectionCard
              {...ref}
              rule={connection.productSelection}
              canManage={canManage}
            />
          }
        />
      </TabsContent>
    </Tabs>
  );
}

interface ChannelConnectionProps {
  workspace: Workspace;
  connectionId: string;
  tab: ChannelTab;
}

function ChannelConnection({ workspace, connectionId, tab }: ChannelConnectionProps) {
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

  const name = connectionName(connection);
  const canManage = canManageWorkspace(workspace.role);
  const isConnected = connection.status === ChannelConnectionStatus.CONNECTED;
  const ref = { workspaceId: workspace.id, connectionId };
  return (
    <Page
      name={name}
      parents={PAGE_PARENTS.channels}
      title={
        <>
          <ConnectionSwitcher
            workspaceId={workspace.id}
            connection={connection}
            tab={tab}
            canManage={canManage}
          />
          <ConnectionStatusBadge status={connection.status} />
        </>
      }
      description={connection.externalAccountId}
      actions={canManage && <ChannelSyncButton {...ref} disabled={!isConnected} />}
    >
      <ReturnToProvider parents={PAGE_PARENTS.channels} label={name}>
        <ChannelConnectionTabs workspace={workspace} connection={connection} tab={tab} />
      </ReturnToProvider>
    </Page>
  );
}

export function ChannelConnectionPage() {
  const params = useParams();
  const connectionId = params[ROUTE_PARAMS.connectionId] ?? '';
  const tab = toChannelTab(params[ROUTE_PARAMS.tab]);
  return (
    <WorkspaceGate>
      {(workspace) => (
        <ChannelConnection workspace={workspace} connectionId={connectionId} tab={tab} />
      )}
    </WorkspaceGate>
  );
}
