import { useMemo } from 'react';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useCatalogStats } from '@/features/catalog/hooks/useCatalogStats';
import { CHANNELS } from '@/features/channels';
import type { ChannelInfo } from '@/features/channels/channels.constants';
import { useListingHealth } from '@/features/listing-health/hooks/useListingHealth';
import { type AccountMapInput, buildAccountMap } from '../account-map-graph';
import { CHANNEL_MAP_COPY, ChannelMapView, MapNodeType } from '../channel-map.constants';
import type { MapOverlay } from '../channel-map.types';
import { useChannelMapView } from '../hooks/useChannelMapView';
import { AccountChannelList } from './AccountChannelList';
import { CatalogHubNode } from './CatalogHubNode';
import { ChannelMapCanvas } from './ChannelMapCanvas';
import { GhostChannelNode } from './GhostChannelNode';
import { MapViewToggle } from './MapViewToggle';
import { StoreNode } from './StoreNode';

const NODE_TYPES = {
  [MapNodeType.Catalog]: CatalogHubNode,
  [MapNodeType.Store]: StoreNode,
  [MapNodeType.GhostChannel]: GhostChannelNode,
};

function AccountMapGraphView({
  fill,
  stores,
  productCount,
  channels,
  overlay,
}: AccountMapInput & { fill: boolean }) {
  const graph = useMemo(
    () => buildAccountMap({ stores, productCount, channels, overlay }),
    [stores, productCount, channels, overlay],
  );
  return (
    <ChannelMapCanvas
      nodes={graph.nodes}
      edges={graph.edges}
      nodeTypes={NODE_TYPES}
      graphHeight={graph.height}
      label={CHANNEL_MAP_COPY.accountGraphLabel}
      fill={fill}
    />
  );
}

interface AccountChannelMapProps {
  workspaceId: string;
  /** What a live view lays over the map, such as Crossmart Agent at work. */
  overlay?: MapOverlay;
  /** Fill the parent's height, as a column of a page, instead of growing with the graph. */
  fill?: boolean;
  /** Draw the channels that cannot be connected yet, faintly. */
  showComingSoon?: boolean;
}

const NO_CHANNELS: readonly ChannelInfo[] = [];

/**
 * The catalog and every store it feeds, from the listings report the overview uses: one request
 * for every store's counts per state, and the catalog's stats for its size.
 */
export function AccountChannelMap({
  workspaceId,
  overlay,
  fill = false,
  showComingSoon = true,
}: AccountChannelMapProps) {
  const health = useListingHealth(workspaceId);
  const stats = useCatalogStats(workspaceId);
  const { view, setView, canShowGraph } = useChannelMapView();
  if (health.isPending) return <Skeleton className="h-96 w-full" />;
  if (health.isError) {
    return (
      <ErrorState
        title={CHANNEL_MAP_COPY.loadError}
        error={health.error}
        onRetry={health.refetch}
      />
    );
  }
  const input: AccountMapInput = {
    stores: health.data.stores,
    productCount: stats.data?.products,
    channels: showComingSoon ? CHANNELS : NO_CHANNELS,
    overlay,
  };
  return (
    <div className={cn('flex flex-col gap-3', fill && 'h-full min-h-0')}>
      {canShowGraph && (
        <div className="flex justify-end">
          <MapViewToggle value={view} onChange={setView} />
        </div>
      )}
      {view === ChannelMapView.Graph ? (
        <AccountMapGraphView {...input} fill={fill} />
      ) : (
        <AccountChannelList {...input} />
      )}
    </div>
  );
}
