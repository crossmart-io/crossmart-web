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
import { ChannelCard } from './ChannelCard';
import { ConnectableChannelCard } from './ConnectableChannelCard';

const NO_CONNECTIONS: readonly ChannelConnection[] = [];

interface ChannelGridItemProps {
  workspaceId: string;
  channel: ChannelInfo;
  /** The workspace's stores that are not disconnected, on every channel. */
  connections: readonly ChannelConnection[];
  canManage: boolean;
  /** Whether the user runs this instance, and so may try channels that are coming soon. */
  isPlatformAdmin: boolean;
}

/** A channel that is coming soon and that platform admins may already connect, as a preview. */
function isPreviewFor(channel: ChannelInfo, isPlatformAdmin: boolean): boolean {
  return isPlatformAdmin && channel.status === ChannelStatus.ComingSoon && !!channel.connect;
}

/**
 * A live channel with its stores. A channel that is not live yet shows its roadmap status, unless
 * the workspace already has stores on it, which stay reachable, or a platform admin previews it.
 */
function ChannelGridItem({
  workspaceId,
  channel,
  connections,
  canManage,
  isPlatformAdmin,
}: ChannelGridItemProps) {
  const stores = connections.filter((connection) => connection.channel === channel.connect?.type);
  const preview = isPreviewFor(channel, isPlatformAdmin);
  const storesCard = (connect: ConnectableChannel) => (
    <ConnectableChannelCard
      workspaceId={workspaceId}
      channel={channel}
      connect={connect}
      connections={stores}
      canManage={canManage}
      preview={preview}
    />
  );

  if (channel.status === ChannelStatus.Live) return storesCard(channel.connect);
  if (channel.connect && (preview || stores.length > 0)) return storesCard(channel.connect);
  return <ChannelCard channel={channel} />;
}

/** Every channel: live ones with their stores, the rest with their roadmap status. */
export function ChannelGrid({ workspace }: { workspace: Workspace }) {
  const { data } = useChannelConnections(workspace.id);
  const active = (data ?? NO_CONNECTIONS).filter(
    (connection) => connection.status !== ChannelConnectionStatus.DISCONNECTED,
  );
  const canManage = hasPermission(workspace, WorkspacePermission.channels_manage);
  const isPlatformAdmin = useMe().data?.platformAdmin ?? false;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CHANNELS.map((channel) => (
        <ChannelGridItem
          key={channel.name}
          workspaceId={workspace.id}
          channel={channel}
          connections={active}
          canManage={canManage}
          isPlatformAdmin={isPlatformAdmin}
        />
      ))}
    </div>
  );
}
