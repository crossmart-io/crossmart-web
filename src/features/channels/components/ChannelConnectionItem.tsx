import { Settings2 } from 'lucide-react';
import { Link } from 'react-router';
import { ChannelConnectionStatus } from '@/api/schema';
import { Button } from '@/components/ui/button';
import { toChannelConnectionRoute } from '@/config/routes';
import type { ChannelInfo, ConnectableChannel } from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { ChannelImportSection } from './ChannelImportSection';
import { ConnectionActions } from './ConnectionActions';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';

interface ChannelConnectionItemProps {
  workspaceId: string;
  channel: ChannelInfo;
  connect: ConnectableChannel;
  connection: ChannelConnection;
  canManage: boolean;
  canEditCatalog: boolean;
}

/** One connected account: its name and domain, status, and what the merchant can do with it. */
export function ChannelConnectionItem({
  workspaceId,
  channel,
  connect,
  connection,
  canManage,
  canEditCatalog,
}: ChannelConnectionItemProps) {
  const needsReauth = connection.status === ChannelConnectionStatus.NEEDS_REAUTH;
  const canImport = canEditCatalog && connection.status === ChannelConnectionStatus.CONNECTED;
  const name = connection.shopify?.shopName ?? connection.displayName;
  const actions = (
    <>
      <Button asChild variant="outline" size="sm">
        <Link to={toChannelConnectionRoute(connection.id)}>
          <Settings2 data-icon="inline-start" />
          Manage
        </Link>
      </Button>
      {canManage && (
        <ConnectionActions
          workspaceId={workspaceId}
          channel={channel}
          connect={connect}
          connection={connection}
          name={name}
        />
      )}
    </>
  );

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
      {canImport ? (
        <ChannelImportSection
          workspaceId={workspaceId}
          connection={connection}
          channelName={channel.name}
        >
          {actions}
        </ChannelImportSection>
      ) : (
        <div className="flex flex-wrap gap-2">{actions}</div>
      )}
    </li>
  );
}
