import type { ReactNode } from 'react';
import { ChannelConnectionStatus } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import { channelInfoFor } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { connectionName } from '../connection-name';
import { ChannelImportSection } from './ChannelImportSection';
import { ConnectionActions } from './ConnectionActions';

interface ConnectionSettingsProps {
  workspaceId: string;
  connection: ChannelConnection;
  canManage: boolean;
  canEditCatalog: boolean;
  onDisconnected: () => void;
  /** The store's automatic product rule, from the listings feature. */
  automaticRule?: ReactNode;
  /** Sends the whole store again, from the listings feature; for recovery. */
  resyncAction?: ReactNode;
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm break-words">{children}</dd>
    </div>
  );
}

/** What Crossmart knows about the connected store, and the permissions it was granted. */
function StoreDetailsCard({ connection }: { connection: ChannelConnection }) {
  const shopify = connection.shopify;
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
          <Detail label="Name">{connectionName(connection)}</Detail>
          <Detail label="Domain">{connection.externalAccountId}</Detail>
          {shopify?.primaryDomainUrl && (
            <Detail label="Storefront">
              <a
                href={shopify.primaryDomainUrl}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                {shopify.primaryDomainUrl}
              </a>
            </Detail>
          )}
          {shopify && <Detail label="Currency">{shopify.currencyCode}</Detail>}
          {shopify?.primaryLocation && (
            <Detail label="Stock location">{shopify.primaryLocation.name}</Detail>
          )}
          <Detail label="Connected">{formatDate(connection.connectedAt)}</Detail>
          <Detail label="Permissions">
            <span className="flex flex-wrap gap-1">
              {connection.grantedScopes.map((scope) => (
                <Badge key={scope} variant="secondary">
                  {scope}
                </Badge>
              ))}
            </span>
          </Detail>
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
}: Omit<ConnectionSettingsProps, 'canManage' | 'canEditCatalog' | 'automaticRule'>) {
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
  canEditCatalog,
  onDisconnected,
  automaticRule,
  resyncAction,
}: ConnectionSettingsProps) {
  const isConnected = connection.status === ChannelConnectionStatus.CONNECTED;
  return (
    <div className="flex flex-col gap-6">
      <StoreDetailsCard connection={connection} />
      {automaticRule}
      {canEditCatalog && isConnected && (
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
