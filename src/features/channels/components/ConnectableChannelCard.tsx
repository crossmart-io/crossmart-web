import { CircleDashed, Plus, Settings2 } from 'lucide-react';
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
import { connectionsSummary, headlineStatus, needsReconnect } from '../connection-status';
import { missingSetup, PUBLISH_READINESS_COPY } from '../publish-requirements';
import { ChannelCardHeader } from './ChannelCardHeader';
import { ConnectChannelDialog } from './ConnectChannelDialog';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';
import { ConnectStoreButton } from './ConnectStoreButton';

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

/** The first connected store that cannot publish until its setup is finished. */
function storeNeedingSetup(
  connections: readonly ChannelConnection[],
): ChannelConnection | undefined {
  return connections.find(
    (connection) => !needsReconnect(connection.status) && missingSetup(connection).length > 0,
  );
}

/** Says a store waits on its setup, and links to the store, where the alert lists what. */
function SetupNeededNote({ connections }: { connections: readonly ChannelConnection[] }) {
  const store = storeNeedingSetup(connections);
  if (!store) return null;
  return (
    <p className="flex items-center gap-1.5 text-sm text-warning">
      <CircleDashed className="size-4 shrink-0" aria-hidden="true" />
      <span>
        {PUBLISH_READINESS_COPY.cardNote}
        {connections.length > 1 && ` (${store.displayName})`}.{' '}
        <Link
          to={toChannelConnectionRoute(store.id)}
          className="font-medium text-foreground underline"
        >
          {PUBLISH_READINESS_COPY.cardAction}
        </Link>
      </span>
    </p>
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
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to={toChannelConnectionRoute(store.id)}>
            <Settings2 data-icon="inline-start" />
            Manage
          </Link>
        </Button>
        {canManage && (
          <ConnectStoreButton
            workspaceId={workspaceId}
            channel={channel}
            connect={connect}
            variant="ghost"
          />
        )}
      </div>
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
 * A channel whose connector has shipped, at a glance: how many stores are connected and which
 * need attention. Stores are listed, managed and added on a store's own page.
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
          <p className="text-sm text-muted-foreground">{connectionsSummary(connections)}</p>
        )}
        <SetupNeededNote connections={connections} />
      </CardContent>
      <CardFooter className="mt-auto">
        <CardActions {...props} />
      </CardFooter>
    </Card>
  );
}
