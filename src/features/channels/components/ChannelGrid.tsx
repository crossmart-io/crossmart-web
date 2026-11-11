import { ChannelConnectionStatus, WorkspacePermission } from '@/api/schema';
import type { Workspace } from '@/features/workspaces';
import { hasPermission, useMe } from '@/features/workspaces';
import {
  CHANNELS,
  ChannelStatus,
  type ChannelInfo,
  type ConnectableChannel,
} from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { useChannelConnections } from '../hooks/useChannelConnections';
import { useConnectChannelParam } from '../hooks/useConnectChannelParam';
import { ConnectableChannelCard } from './ConnectableChannelCard';
import { ConnectChannelDialog } from './ConnectChannelDialog';
import { RequestChannelLink } from './RequestChannelLink';

const NO_CONNECTIONS: readonly ChannelConnection[] = [];

/** A channel that is coming soon and that platform admins may already connect, as a preview. */
function isPreviewFor(channel: ChannelInfo, isPlatformAdmin: boolean): boolean {
  return isPlatformAdmin && channel.status === ChannelStatus.ComingSoon && !!channel.connect;
}

/**
 * Whether the channel gets a card: a live one, one a platform admin previews, or one the
 * workspace already has stores on, which stay reachable. The rest are only a request away.
 */
function isShown(channel: ChannelInfo, stores: number, isPlatformAdmin: boolean): boolean {
  if (!channel.connect) return false;
  return (
    channel.status === ChannelStatus.Live || isPreviewFor(channel, isPlatformAdmin) || stores > 0
  );
}

interface ShownChannel {
  channel: ChannelInfo;
  connect: ConnectableChannel;
  stores: ChannelConnection[];
}

/**
 * The connect dialog a link asks for (`?connect=<channel>`), when the channel has a card here
 * and the person may connect stores. Closing it drops the parameter.
 */
function RequestedConnectDialog({
  workspaceId,
  cards,
  canManage,
}: {
  workspaceId: string;
  cards: readonly ShownChannel[];
  canManage: boolean;
}) {
  const requested = useConnectChannelParam();
  const card = cards.find(({ connect }) => connect.type === requested.channel);
  if (!card || !canManage) return null;
  return (
    <ConnectChannelDialog
      workspaceId={workspaceId}
      channel={card.channel}
      connect={card.connect}
      open
      onOpenChange={(open) => {
        if (!open) requested.clear();
      }}
    />
  );
}

/** The channels a store can be connected on, each with its stores, then a way to ask for more. */
export function ChannelGrid({ workspace }: { workspace: Workspace }) {
  const { data } = useChannelConnections(workspace.id);
  const active = (data ?? NO_CONNECTIONS).filter(
    (connection) => connection.status !== ChannelConnectionStatus.DISCONNECTED,
  );
  const canManage = hasPermission(workspace, WorkspacePermission.channels_manage);
  const isPlatformAdmin = useMe().data?.platformAdmin ?? false;
  const cards: ShownChannel[] = CHANNELS.flatMap((channel) => {
    const stores = active.filter((connection) => connection.channel === channel.connect?.type);
    const { connect } = channel;
    return connect && isShown(channel, stores.length, isPlatformAdmin)
      ? [{ channel, connect, stores }]
      : [];
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ channel, connect, stores }) => (
          <ConnectableChannelCard
            key={channel.name}
            workspaceId={workspace.id}
            channel={channel}
            connect={connect}
            connections={stores}
            canManage={canManage}
            preview={isPreviewFor(channel, isPlatformAdmin)}
          />
        ))}
      </div>
      <RequestChannelLink />
      <RequestedConnectDialog workspaceId={workspace.id} cards={cards} canManage={canManage} />
    </div>
  );
}
