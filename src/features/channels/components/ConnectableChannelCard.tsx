import { Plus, Settings2 } from 'lucide-react';
import { Link } from 'react-router';
import { ChannelConnectionStatus } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toChannelConnectionRoute } from '@/config/routes';
import {
  CHANNEL_STATUS_LABELS,
  type ChannelInfo,
  type ConnectableChannel,
} from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { headlineStatus } from '../connection-status';
import { ChannelCardHeader } from './ChannelCardHeader';
import { ChannelConnectionItem } from './ChannelConnectionItem';
import { ConnectChannelDialog } from './ConnectChannelDialog';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';

interface ConnectableChannelCardProps {
  workspaceId: string;
  channel: ChannelInfo;
  connect: ConnectableChannel;
  /** This channel's connections that are not disconnected. */
  connections: readonly ChannelConnection[];
  canManage: boolean;
}

/** The store to open first: one that needs attention, else the first connected. */
function storeToManage(connections: readonly ChannelConnection[]): ChannelConnection | undefined {
  return (
    connections.find((connection) => connection.status !== ChannelConnectionStatus.CONNECTED) ??
    connections[0]
  );
}

function CardActions({
  workspaceId,
  channel,
  connect,
  connections,
  canManage,
}: ConnectableChannelCardProps) {
  const store = storeToManage(connections);
  if (store) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link to={toChannelConnectionRoute(store.id)}>
          <Settings2 data-icon="inline-start" />
          Manage
        </Link>
      </Button>
    );
  }
  if (!canManage) {
    return <p className="text-sm text-muted-foreground">Ask a workspace admin to connect it.</p>;
  }
  return (
    <ConnectChannelDialog
      workspaceId={workspaceId}
      channel={channel}
      connect={connect}
      trigger={
        <Button size="sm">
          <Plus data-icon="inline-start" />
          Connect
        </Button>
      }
    />
  );
}

/**
 * A channel whose connector has shipped, at a glance: its connected stores and their status.
 * Stores are managed, and more are connected, on a store's own page.
 */
export function ConnectableChannelCard(props: ConnectableChannelCardProps) {
  const { channel, connections } = props;
  const status = headlineStatus(connections);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <ChannelCardHeader
          channel={channel}
          badge={
            status ? (
              <ConnectionStatusBadge status={status} />
            ) : (
              <Badge variant="outline">{CHANNEL_STATUS_LABELS[channel.status]}</Badge>
            )
          }
        />
        {connections.length > 0 && (
          <ul className="flex flex-col gap-2" aria-label={`Connected ${channel.name} accounts`}>
            {connections.map((connection) => (
              <ChannelConnectionItem
                key={connection.id}
                channel={channel}
                connection={connection}
              />
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <CardActions {...props} />
      </CardFooter>
    </Card>
  );
}
