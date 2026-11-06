import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChannelInfo, ConnectableChannel } from '../channels.constants';
import { RECONNECT_COPY } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { reconnectAccountHandle } from '../connection-account';
import { ConnectChannelDialog } from './ConnectChannelDialog';

interface ReconnectButtonProps {
  workspaceId: string;
  channel: ChannelInfo;
  connect: ConnectableChannel;
  connection: ChannelConnection;
}

/** Connects the same account again, with the account filled in, to restore the store's access. */
export function ReconnectButton({
  workspaceId,
  channel,
  connect,
  connection,
}: ReconnectButtonProps) {
  return (
    <ConnectChannelDialog
      workspaceId={workspaceId}
      channel={channel}
      connect={connect}
      initialAccount={reconnectAccountHandle(connection)}
      trigger={
        <Button size="sm">
          <RefreshCw data-icon="inline-start" />
          {RECONNECT_COPY.action}
        </Button>
      }
    />
  );
}
