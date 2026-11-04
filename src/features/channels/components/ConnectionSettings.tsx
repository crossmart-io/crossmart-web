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
          {connection.ebay ? (
            <EbayAccountDetails ebay={connection.ebay} />
          ) : (
            <ShopifyAccountDetails connection={connection} />
          )}
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
            'Changes reach the store at once. Resync sends everything again, after an outage or a change made in the store. Disconnecting keeps your products in both places.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {resyncAction}
        <ConnectionActions
          workspaceId={workspaceId}
          channel={channel}
          connect={channel.connect}
          connection={connection}
          name={connectionName(connection)}
          onDisconnected={onDisconnected}
        />
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
      {connection.ebay && (
        <EbayListingDefaultsCard
          workspaceId={workspaceId}
          connectionId={connection.id}
          ebay={connection.ebay}
          canManage={canManage && isConnected}
        />
      )}
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
