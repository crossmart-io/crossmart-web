import type { ComponentProps } from 'react';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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

interface ConnectButtonProps extends ComponentProps<typeof Button> {
  hasConnections: boolean;
}

/** Forwards its props, so a dialog trigger can open the dialog with it. */
function ConnectButton({ hasConnections, ...props }: ConnectButtonProps) {
  return (
    <Button
      {...props}
      variant={hasConnections ? 'ghost' : 'default'}
      size="sm"
      className={hasConnections ? '-ml-2' : undefined}
    >
      <Plus data-icon="inline-start" />
      {hasConnections ? 'Connect another store' : 'Connect'}
    </Button>
  );
}

/** A channel whose connector has shipped: its connected accounts, and a way to add one. */
export function ConnectableChannelCard({
  workspaceId,
  channel,
  connect,
  connections,
  canManage,
}: ConnectableChannelCardProps) {
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
                workspaceId={workspaceId}
                channel={channel}
                connect={connect}
                connection={connection}
                canManage={canManage}
              />
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        {canManage ? (
          <ConnectChannelDialog
            workspaceId={workspaceId}
            channel={channel}
            connect={connect}
            trigger={<ConnectButton hasConnections={connections.length > 0} />}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Ask a workspace admin to connect it.</p>
        )}
      </CardFooter>
    </Card>
  );
}
