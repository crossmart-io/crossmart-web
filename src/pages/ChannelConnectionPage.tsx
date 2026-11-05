import { useNavigate, useParams } from 'react-router';
import { ChannelConnectionStatus, WorkspacePermission } from '@/api/schema';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { type ResourcePageCopy, ResourcePage } from '@/components/layout/ResourcePage';
import { ReturnToProvider } from '@/components/navigation/ReturnToProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PAGE_PARENTS } from '@/config/navigation';
import { ROUTE_PARAMS, ROUTES, toChannelConnectionRoute } from '@/config/routes';
import {
  type ChannelConnection,
  ConnectionSettings,
  ConnectionStatusBadge,
  ConnectionSwitcher,
  connectionCurrency,
  connectionName,
  MissingFeaturesAlert,
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
import { hasPermission, type Workspace } from '@/features/workspaces';

const CONNECTION_PAGE_COPY: ResourcePageCopy = {
  name: 'Channel',
  notFoundName: 'Channel not found',
  notFound: 'This connection does not exist or was removed.',
  loadFailed: 'This channel could not be loaded',
};

interface ChannelConnectionTabsProps {
  workspace: Workspace;
  connection: ChannelConnection;
  tab: ChannelTab;
}

/** One tab per part of the connection; each tab has its own URL so it can be linked to. */
function ChannelConnectionTabs({ workspace, connection, tab }: ChannelConnectionTabsProps) {
  const navigate = useNavigate();
  const canManage = hasPermission(workspace, WorkspacePermission.channels_manage);
  const canEditListings = hasPermission(workspace, WorkspacePermission.listings_edit);
  const currency = connectionCurrency(connection) ?? workspace.currency;
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
        <ChannelProductsCard {...ref} canEdit={canEditListings} />
      </TabsContent>
      <TabsContent value={ChannelTab.Pricing}>
        <PricingRuleCard
          {...ref}
          currency={currency}
          catalogCurrency={workspace.currency}
          rule={connection.pricing}
          canManage={canManage}
        />
      </TabsContent>
      <TabsContent value={ChannelTab.Settings}>
        <ConnectionSettings
          workspaceId={workspace.id}
          connection={connection}
          canManage={canManage}
          canImportProducts={hasPermission(workspace, WorkspacePermission.products_edit)}
          onDisconnected={() => void navigate(ROUTES.channels)}
          resyncAction={
            <ChannelSyncButton
              {...ref}
              disabled={connection.status !== ChannelConnectionStatus.CONNECTED}
            />
          }
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

interface ConnectionViewProps {
  workspace: Workspace;
  connection: ChannelConnection;
  tab: ChannelTab;
}

/** The connection once it has loaded: its switcher, status, missing features and tabs. */
function ConnectionView({ workspace, connection, tab }: ConnectionViewProps) {
  const name = connectionName(connection);
  const canManage = hasPermission(workspace, WorkspacePermission.channels_manage);
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
    >
      <MissingFeaturesAlert
        workspaceId={workspace.id}
        connection={connection}
        canManage={canManage}
      />
      <ReturnToProvider parents={PAGE_PARENTS.channels} label={name}>
        <ChannelConnectionTabs workspace={workspace} connection={connection} tab={tab} />
      </ReturnToProvider>
    </Page>
  );
}

function ChannelConnectionDetails({ workspace, connectionId, tab }: ChannelConnectionProps) {
  const query = useChannelConnection(workspace.id, connectionId);
  return (
    <ResourcePage query={query} copy={CONNECTION_PAGE_COPY} parents={PAGE_PARENTS.channels}>
      {(connection) => <ConnectionView workspace={workspace} connection={connection} tab={tab} />}
    </ResourcePage>
  );
}

export function ChannelConnectionPage() {
  const params = useParams();
  const connectionId = params[ROUTE_PARAMS.connectionId] ?? '';
  const tab = toChannelTab(params[ROUTE_PARAMS.tab]);
  return (
    <WorkspaceGate>
      {(workspace) => (
        <ChannelConnectionDetails workspace={workspace} connectionId={connectionId} tab={tab} />
      )}
    </WorkspaceGate>
  );
}
