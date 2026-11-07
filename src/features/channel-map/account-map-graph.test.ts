import { ListingDisplayState } from '@/api/schema';
import { CHANNELS } from '@/features/channels/channels.constants';
import { storeHealthFixture } from '@/features/listing-health/testing/listing-health.fixture';
import { buildAccountMap, CATALOG_NODE_ID } from './account-map-graph';
import {
  MAP_LAYOUT,
  MAP_STATUS_PRESENTATION,
  MapNodeType,
  MapStatus,
} from './channel-map.constants';

describe('buildAccountMap', () => {
  const stores = [
    storeHealthFixture({ [ListingDisplayState.published]: 5, [ListingDisplayState.failed]: 1 }),
    storeHealthFixture(
      { [ListingDisplayState.draft]: 8 },
      { connectionId: 'c-2', displayName: 'South shop' },
    ),
  ];
  const graph = buildAccountMap({ stores, productCount: 8, channels: CHANNELS });

  it('links the catalog to each store and each channel coming soon', () => {
    expect(graph.nodes.map((node) => node.type)).toEqual([
      MapNodeType.Catalog,
      MapNodeType.Store,
      MapNodeType.Store,
      MapNodeType.GhostChannel,
      MapNodeType.GhostChannel,
    ]);
    expect(graph.edges.every((edge) => edge.source === CATALOG_NODE_ID)).toBe(true);
  });

  it('colours each store’s edge by its most urgent status', () => {
    expect(graph.edges[0]?.style?.stroke).toBe(MAP_STATUS_PRESENTATION[MapStatus.Failed].stroke);
    expect(graph.edges[1]?.style?.stroke).toBe(MAP_STATUS_PRESENTATION[MapStatus.NotListed].stroke);
  });

  it('stacks the column without overlaps', () => {
    const leaves = graph.nodes.slice(1).map((node) => node.position.y);
    expect((leaves[1] ?? 0) - (leaves[0] ?? 0)).toBeGreaterThanOrEqual(MAP_LAYOUT.storeLeafHeight);
  });
});
