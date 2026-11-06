import { ChannelConnectionStatus } from '@/api/schema';
import { CircleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { channelInfoFor, RECONNECT_COPY } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { ReconnectButton } from './ReconnectButton';

interface ReconnectAlertProps {
  workspaceId: string;
  connection: ChannelConnection;
  /** Only workspace admins can reconnect a store. */
  canManage: boolean;
}

type ReconnectStatus = keyof typeof RECONNECT_COPY.titles;

/**
 * Above the store's tabs while it cannot sync: why, in the API's own words, and the way back.
 * Renders nothing for a connected store.
 */
export function ReconnectAlert({ workspaceId, connection, canManage }: ReconnectAlertProps) {
  const { status } = connection;
  if (status === ChannelConnectionStatus.CONNECTED) return null;
  const channel = channelInfoFor(connection.channel);
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertTitle>{RECONNECT_COPY.titles[status satisfies ReconnectStatus]}</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <p>{connection.statusReason ?? RECONNECT_COPY.fallbackReason}</p>
        {!canManage && <p>{RECONNECT_COPY.askAdmin}</p>}
        {canManage && channel?.connect && (
          <ReconnectButton
            workspaceId={workspaceId}
            channel={channel}
            connect={channel.connect}
            connection={connection}
          />
        )}
      </AlertDescription>
    </Alert>
  );
}
