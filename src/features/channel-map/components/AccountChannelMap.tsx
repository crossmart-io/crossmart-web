import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { useCatalogStats } from '@/features/catalog/hooks/useCatalogStats';
import { CHANNELS } from '@/features/channels';
import { useListingHealth } from '@/features/listing-health/hooks/useListingHealth';
import { type AccountMapInput, buildAccountMap } from '../account-map-graph';
import { CHANNEL_MAP_COPY, ChannelMapView, MapNodeType } from '../channel-map.constants';
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

function AccountMapGraphView(props: AccountMapInput) {
  const graph = buildAccountMap(props);
  return (
    <ChannelMapCanvas
      nodes={graph.nodes}
      edges={graph.edges}
      nodeTypes={NODE_TYPES}
      graphHeight={graph.height}
      label={CHANNEL_MAP_COPY.accountGraphLabel}
    />
  );
}

/**
 * The catalog and every store it feeds, from the listings report the overview uses: one request
 * for every store's counts per state, and the catalog's stats for its size.
 */
export function AccountChannelMap({ workspaceId }: { workspaceId: string }) {
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
    channels: CHANNELS,
  };
  return (
    <div className="flex flex-col gap-3">
      {canShowGraph && (
        <div className="flex justify-end">
          <MapViewToggle value={view} onChange={setView} />
        </div>
      )}
      {view === ChannelMapView.Graph ? (
        <AccountMapGraphView {...input} />
      ) : (
        <AccountChannelList {...input} />
      )}
    </div>
  );
}
