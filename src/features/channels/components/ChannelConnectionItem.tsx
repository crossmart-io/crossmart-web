import { ChannelConnectionStatus } from '@/api/schema';
import type { ChannelInfo } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { connectionName } from '../connection-name';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';

interface ChannelConnectionItemProps {
  channel: ChannelInfo;
  connection: ChannelConnection;
}

/** One connected account at a glance: its name, domain and status. It is managed on its page. */
export function ChannelConnectionItem({ channel, connection }: ChannelConnectionItemProps) {
  const needsReauth = connection.status === ChannelConnectionStatus.NEEDS_REAUTH;
  return (
    <li className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{connectionName(connection)}</span>
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
    </li>
  );
}
