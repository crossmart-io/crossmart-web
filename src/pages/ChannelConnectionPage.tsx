import { Navigate, useNavigate, useParams } from 'react-router';
import { ChannelConnectionStatus, WorkspacePermission } from '@/api/schema';
import { WorkspaceGate } from '@/components/feedback/WorkspaceGate';
import { Page } from '@/components/layout/Page';
import { type ResourcePageCopy, ResourcePage } from '@/components/layout/ResourcePage';
import { ReturnToProvider } from '@/components/navigation/ReturnToProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PAGE_PARENTS } from '@/config/navigation';
import { PageSection, ROUTE_PARAMS, ROUTES, toChannelConnectionRoute } from '@/config/routes';
import {
  type ChannelConnection,
  channelInfoFor,
  ConnectionSettings,
  ConnectStoreButton,
  ConnectionStatusBadge,
  ConnectionSwitcher,
  connectionCurrency,
  connectionName,
  MissingFeaturesAlert,
  needsReconnect,
  ReconnectAlert,
} from '@/features/channels';
import {
  CHANNEL_TABS,
  ChannelProductsCard,
  ChannelSyncButton,
  ChannelTab,
  PricingRuleCard,
  ProductSelectionCard,
  PublishReadinessAlert,
  retiredChannelTabRoute,
  toChannelTab,
  useChannelConnection,
} from '@/features/listings';
import { hasPermission, type Workspace } from '@/features/workspaces';
import { useScrollToSection } from '@/hooks/useScrollToSection';

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

/**
 * The connection's settings, with the listings feature's sync button, pricing rule and automatic
 * rule. Per-product prices are set in each product's listing editor instead.
 */
function SettingsTab({ workspace, connection }: Omit<ChannelConnectionTabsProps, 'tab'>) {
  const navigate = useNavigate();
  const canManage = hasPermission(workspace, WorkspacePermission.channels_manage);
  const ref = { workspaceId: workspace.id, connectionId: connection.id };
  useScrollToSection();
  return (
    <ConnectionSettings
      workspaceId={workspace.id}
      connection={connection}
      canManage={canManage}
      canImportProducts={hasPermission(workspace, WorkspacePermission.products_edit)}
      onDisconnected={() => void navigate(ROUTES.channels)}
      resyncAction={
        <ChannelSyncButton
          {...ref}
          channel={connection.channel}
          disabled={connection.status !== ChannelConnectionStatus.CONNECTED}
        />
      }
      pricing={
        <PricingRuleCard
          {...ref}
          id={PageSection.StorePricing}
          currency={connectionCurrency(connection) ?? workspace.currency}
          catalogCurrency={workspace.currency}
          rule={connection.pricing}
          canManage={canManage}
        />
      }
      automaticRule={
        <ProductSelectionCard {...ref} rule={connection.productSelection} canManage={canManage} />
      }
    />
  );
}

/** One tab per part of the connection; each tab has its own URL so it can be linked to. */
function ChannelConnectionTabs({ workspace, connection, tab }: ChannelConnectionTabsProps) {
  const navigate = useNavigate();
  const canEditListings = hasPermission(workspace, WorkspacePermission.listings_edit);
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
        <ChannelProductsCard
          workspaceId={workspace.id}
          catalogCurrency={workspace.currency}
          connection={connection}
          canEdit={canEditListings}
        />
      </TabsContent>
      <TabsContent value={ChannelTab.Settings}>
        <SettingsTab workspace={workspace} connection={connection} />
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

/** Connecting one more store of this channel, for admins, beside the store switcher. */
function ConnectAnotherStore({
  workspaceId,
  connection,
}: {
  workspaceId: string;
  connection: ChannelConnection;
}) {
  const channel = channelInfoFor(connection.channel);
  if (!channel?.connect) return null;
  return (
    <ConnectStoreButton workspaceId={workspaceId} channel={channel} connect={channel.connect} />
  );
}

/** The connection once it has loaded: its switcher, status, missing features and tabs. */
function ConnectionView({ workspace, connection, tab }: ConnectionViewProps) {
  const name = connectionName(connection);
  const canManage = hasPermission(workspace, WorkspacePermission.channels_manage);
  return (
    <Page
      name={name}
      parents={PAGE_PARENTS.channels}
      actions={
        canManage && <ConnectAnotherStore workspaceId={workspace.id} connection={connection} />
      }
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
      {/* A store that must be reconnected says why first; reconnecting also grants the
          permissions the missing-features alert asks for. */}
      {needsReconnect(connection.status) ? (
        <ReconnectAlert workspaceId={workspace.id} connection={connection} canManage={canManage} />
      ) : (
        <MissingFeaturesAlert
          workspaceId={workspace.id}
          connection={connection}
          canManage={canManage}
        />
      )}
      <PublishReadinessAlert
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
  const segment = params[ROUTE_PARAMS.tab];
  const retiredTabRoute = retiredChannelTabRoute(connectionId, segment);
  // An old link to a tab that moved, such as Pricing, lands on the section that replaced it.
  if (retiredTabRoute) return <Navigate to={retiredTabRoute} replace />;
  const tab = toChannelTab(segment);
  return (
    <WorkspaceGate>
      {(workspace) => (
        <ChannelConnectionDetails workspace={workspace} connectionId={connectionId} tab={tab} />
      )}
    </WorkspaceGate>
  );
}
