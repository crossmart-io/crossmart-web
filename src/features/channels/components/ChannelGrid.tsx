import { ChannelConnectionStatus, WorkspacePermission } from '@/api/schema';
import type { Workspace } from '@/features/workspaces';
import { hasPermission } from '@/features/workspaces';
import {
  CHANNELS,
  ChannelStatus,
  type ChannelInfo,
  type ConnectableChannel,
} from '../channels.constants';
import type { ChannelConnection } from '../channels.types';
import { useChannelConnections } from '../hooks/useChannelConnections';
import { ChannelCard } from './ChannelCard';
import { ConnectableChannelCard } from './ConnectableChannelCard';

const NO_CONNECTIONS: readonly ChannelConnection[] = [];

interface ChannelGridItemProps {
  workspaceId: string;
  channel: ChannelInfo;
  /** The workspace's stores that are not disconnected, on every channel. */
  connections: readonly ChannelConnection[];
  canManage: boolean;
}

/**
 * A live channel with its stores. A channel that is not live yet shows its roadmap status, unless
 * the workspace already has stores on it, which stay reachable.
 */
function ChannelGridItem({ workspaceId, channel, connections, canManage }: ChannelGridItemProps) {
  const stores = connections.filter((connection) => connection.channel === channel.connect?.type);
  const storesCard = (connect: ConnectableChannel) => (
    <ConnectableChannelCard
      workspaceId={workspaceId}
      channel={channel}
      connect={connect}
      connections={stores}
      canManage={canManage}
    />
  );

  if (channel.status === ChannelStatus.Live) return storesCard(channel.connect);
  if (channel.connect && stores.length > 0) return storesCard(channel.connect);
  return <ChannelCard channel={channel} />;
}

/** Every channel: live ones with their stores, the rest with their roadmap status. */
export function ChannelGrid({ workspace }: { workspace: Workspace }) {
  const { data } = useChannelConnections(workspace.id);
  const active = (data ?? NO_CONNECTIONS).filter(
    (connection) => connection.status !== ChannelConnectionStatus.DISCONNECTED,
  );
  const canManage = hasPermission(workspace, WorkspacePermission.channels_manage);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CHANNELS.map((channel) => (
        <ChannelGridItem
          key={channel.name}
          workspaceId={workspace.id}
          channel={channel}
          connections={active}
          canManage={canManage}
        />
      ))}
    </div>
  );
}
