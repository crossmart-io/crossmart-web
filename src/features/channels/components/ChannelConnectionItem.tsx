import { RefreshCw, Unplug } from 'lucide-react';
import { ChannelConnectionStatus } from '@/api/schema';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Button } from '@/components/ui/button';
import type { ChannelInfo, ConnectableChannel } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { useDisconnectChannel } from '../hooks/useChannelConnections';
import { ConnectChannelDialog } from './ConnectChannelDialog';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';

interface ChannelConnectionItemProps {
  workspaceId: string;
  channel: ChannelInfo;
  connect: ConnectableChannel;
  connection: ChannelConnection;
  canManage: boolean;
}

/** One connected account: its name and domain, status, and what the merchant can do with it. */
export function ChannelConnectionItem({
  workspaceId,
  channel,
  connect,
  connection,
  canManage,
}: ChannelConnectionItemProps) {
  const disconnect = useDisconnectChannel(workspaceId);
  const needsReauth = connection.status === ChannelConnectionStatus.NEEDS_REAUTH;
  const name = connection.shopify?.shopName ?? connection.displayName;

  return (
    <li className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{name}</span>
          <span className="text-sm break-all text-muted-foreground">
            {connection.externalAccountId}
          </span>
        </div>
        <ConnectionStatusBadge status={connection.status} />
      </div>
      {needsReauth && (
        <p className="text-sm text-warning">
          {connection.statusReason ?? `${channel.name} needs you to approve Crossmart again.`}
        </p>
      )}
      {canManage && (
        <div className="flex flex-wrap gap-2">
          {needsReauth && (
            <ConnectChannelDialog
              workspaceId={workspaceId}
              channel={channel}
              connect={connect}
              initialAccount={connection.externalAccountId}
              trigger={
                <Button size="sm">
                  <RefreshCw data-icon="inline-start" />
                  Reconnect
                </Button>
              }
            />
          )}
          <ConfirmDialog
            trigger={
              <Button variant="outline" size="sm">
                <Unplug data-icon="inline-start" />
                Disconnect
              </Button>
            }
            title={`Disconnect ${name}?`}
            description={`Crossmart stops syncing with this store and removes its access. Your products stay in Crossmart and on ${channel.name}.`}
            confirmLabel="Disconnect"
            onConfirm={() => disconnect.mutateAsync(connection.id)}
          />
        </div>
      )}
    </li>
  );
}
