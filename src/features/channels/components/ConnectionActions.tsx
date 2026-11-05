import { RefreshCw, Unplug } from 'lucide-react';
import { ChannelConnectionStatus } from '@/api/schema';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Button } from '@/components/ui/button';
import type { ChannelInfo, ConnectableChannel } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { reconnectAccountHandle } from '../connection-account';
import { useDisconnectChannel } from '../hooks/useChannelConnections';
import { ConnectChannelDialog } from './ConnectChannelDialog';

interface ConnectionActionsProps {
  workspaceId: string;
  channel: ChannelInfo;
  connect: ConnectableChannel;
  connection: ChannelConnection;
  name: string;
  /** Called once the connection is disconnected, such as to leave its page. */
  onDisconnected?: () => void;
}

/** What a workspace admin can do with a connection: reconnect it, or disconnect it. */
export function ConnectionActions({
  workspaceId,
  channel,
  connect,
  connection,
  name,
  onDisconnected,
}: ConnectionActionsProps) {
  const disconnect = useDisconnectChannel(workspaceId);
  const needsReauth = connection.status === ChannelConnectionStatus.NEEDS_REAUTH;

  return (
    <>
      {needsReauth && (
        <ConnectChannelDialog
          workspaceId={workspaceId}
          channel={channel}
          connect={connect}
          initialAccount={reconnectAccountHandle(connection)}
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
        onConfirm={async () => {
          await disconnect.mutateAsync(connection.id);
          onDisconnected?.();
        }}
      />
    </>
  );
}
