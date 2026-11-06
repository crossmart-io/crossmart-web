import type { ReactNode } from 'react';
import { ChannelConnectionStatus } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import { channelInfoFor } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { connectionName } from '../connection-name';
import { AccountDetail } from './AccountDetail';
import { ChannelImportSection } from './ChannelImportSection';
import { ConnectionActions } from './ConnectionActions';
import { EbayAccountDetails } from './EbayAccountDetails';
import { EbayListingDefaultsCard } from './EbayListingDefaultsCard';
import { GoogleAccountDetails } from './GoogleAccountDetails';
import { GoogleListingSetupCard } from './GoogleListingSetupCard';
import { ShopifyAccountDetails } from './ShopifyAccountDetails';

interface ConnectionSettingsProps {
  workspaceId: string;
  connection: ChannelConnection;
  canManage: boolean;
  canImportProducts: boolean;
  onDisconnected: () => void;
  /** The store's automatic product rule, from the listings feature. */
  automaticRule?: ReactNode;
  /** Sends the whole store again, from the listings feature; for recovery. */
  resyncAction?: ReactNode;
}

/** The channel's own account details. */
function ChannelAccountDetails({ connection }: { connection: ChannelConnection }) {
  if (connection.ebay) return <EbayAccountDetails ebay={connection.ebay} />;
  if (connection.googleMerchant) return <GoogleAccountDetails google={connection.googleMerchant} />;
  return <ShopifyAccountDetails connection={connection} />;
}

/** What the channel needs before it can list: eBay's defaults, Google's listing setup. */
function ChannelSetupCard({
  workspaceId,
  connection,
  canManage,
}: {
  workspaceId: string;
  connection: ChannelConnection;
  canManage: boolean;
}) {
  if (connection.ebay) {
    return (
      <EbayListingDefaultsCard
        workspaceId={workspaceId}
        connectionId={connection.id}
        ebay={connection.ebay}
        canManage={canManage}
      />
    );
  }
  if (connection.googleMerchant) {
    return (
      <GoogleListingSetupCard
        workspaceId={workspaceId}
        connectionId={connection.id}
        googleMerchant={connection.googleMerchant}
        canManage={canManage}
      />
    );
  }
  return null;
}

/** What Crossmart knows about the connected store, and the permissions it was granted. */
function StoreDetailsCard({ connection }: { connection: ChannelConnection }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Store</h2>
        </CardTitle>
        <CardDescription>Read from the store when it was connected.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          <AccountDetail label="Name">{connectionName(connection)}</AccountDetail>
          <ChannelAccountDetails connection={connection} />
          <AccountDetail label="Connected">{formatDate(connection.connectedAt)}</AccountDetail>
          <AccountDetail label="Permissions">
            <span className="flex flex-wrap gap-1">
              {connection.grantedScopes.map((scope) => (
                <Badge key={scope} variant="secondary">
                  {scope}
                </Badge>
              ))}
            </span>
          </AccountDetail>
        </dl>
      </CardContent>
    </Card>
  );
}

function ImportCard({
  workspaceId,
  connection,
}: {
  workspaceId: string;
  connection: ChannelConnection;
}) {
  const channelName = channelInfoFor(connection.channel)?.name ?? connection.displayName;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Import</h2>
        </CardTitle>
        <CardDescription>
          Brings the store’s products into your catalog and links the ones you already have.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChannelImportSection
          workspaceId={workspaceId}
          connection={connection}
          channelName={channelName}
        />
      </CardContent>
    </Card>
  );
}

function ConnectionCard({
  workspaceId,
  connection,
  onDisconnected,
  resyncAction,
}: Omit<ConnectionSettingsProps, 'canManage' | 'canImportProducts' | 'automaticRule'>) {
  const channel = channelInfoFor(connection.channel);
  if (!channel?.connect) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Connection</h2>
        </CardTitle>
        <CardDescription>
          {connection.statusReason ??
            'Changes reach the store at once. Disconnecting keeps your products in both places.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {resyncAction}
        <div className="flex flex-wrap gap-2">
          <ConnectionActions
            workspaceId={workspaceId}
            channel={channel}
            connect={channel.connect}
            connection={connection}
            name={connectionName(connection)}
            onDisconnected={onDisconnected}
          />
        </div>
      </CardContent>
    </Card>
  );
}

/** The connection's own settings: the store, its automatic rule, importing, and the connection. */
export function ConnectionSettings({
  workspaceId,
  connection,
  canManage,
  canImportProducts,
  onDisconnected,
  automaticRule,
  resyncAction,
}: ConnectionSettingsProps) {
  const isConnected = connection.status === ChannelConnectionStatus.CONNECTED;
  const importsCatalog = channelInfoFor(connection.channel)?.connect?.importsCatalog ?? false;
  return (
    <div className="flex flex-col gap-6">
      <StoreDetailsCard connection={connection} />
      <ChannelSetupCard
        workspaceId={workspaceId}
        connection={connection}
        canManage={canManage && isConnected}
      />
      {automaticRule}
      {canImportProducts && isConnected && importsCatalog && (
        <ImportCard workspaceId={workspaceId} connection={connection} />
      )}
      {canManage && (
        <ConnectionCard
          workspaceId={workspaceId}
          connection={connection}
          onDisconnected={onDisconnected}
          resyncAction={resyncAction}
        />
      )}
    </div>
  );
}
