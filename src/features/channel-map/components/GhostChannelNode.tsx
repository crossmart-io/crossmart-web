import type { NodeProps } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { ChannelLogoSize } from '@/features/channels/channels.constants';
import { ChannelLogo } from '@/features/channels/components/ChannelLogo';
import { CHANNEL_MAP_COPY, MapHandleSide } from '../channel-map.constants';
import type {
  GhostChannelNode as GhostChannelNodeType,
  GhostChannelNodeData,
} from '../channel-map.types';
import { MapHandle } from './MapHandle';

/** A channel that cannot be connected yet: faint and dashed, with no figures to show. */
export function GhostChannelCard({ name, logo }: GhostChannelNodeData) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-dashed bg-card/40 p-3 text-sm opacity-70">
      <span className="flex min-w-0 items-center gap-2 grayscale">
        <ChannelLogo logo={logo} size={ChannelLogoSize.Small} />
        <span className="truncate font-medium text-muted-foreground">{name}</span>
      </span>
      <Badge variant="outline" className="text-muted-foreground">
        {CHANNEL_MAP_COPY.comingSoon}
      </Badge>
    </div>
  );
}

export function GhostChannelNode({ data }: NodeProps<GhostChannelNodeType>) {
  return (
    <>
      <MapHandle side={MapHandleSide.Leaf} />
      <GhostChannelCard {...data} />
    </>
  );
}
