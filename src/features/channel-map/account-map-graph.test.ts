import { ListingDisplayState } from '@/api/schema';
import { CHANNELS, ChannelStatus } from '@/features/channels/channels.constants';
import { storeHealthFixture } from '@/features/listing-health/testing/listing-health.fixture';
import { buildAccountMap, CATALOG_NODE_ID } from './account-map-graph';
import {
  MAP_LAYOUT,
  MAP_STATUS_PRESENTATION,
  MapNodeType,
  MapStatus,
  PULSING_EDGE_CLASS,
} from './channel-map.constants';

/** The map panel's canvas on a 1280×800 screen, in pixels. */
const EIGHT_STORE_PANEL_HEIGHT = 420;
const EIGHT_STORES = 8;

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
      ...CHANNELS.filter((channel) => channel.status === ChannelStatus.ComingSoon).map(
        () => MapNodeType.GhostChannel,
      ),
    ]);
    expect(graph.edges.every((edge) => edge.source === CATALOG_NODE_ID)).toBe(true);
  });

  it('colours each store’s edge by its most urgent status', () => {
    expect(graph.edges[0]?.style?.stroke).toBe(MAP_STATUS_PRESENTATION[MapStatus.Failed].stroke);
    expect(graph.edges[1]?.style?.stroke).toBe(MAP_STATUS_PRESENTATION[MapStatus.NotListed].stroke);
  });

  it('stacks the column evenly without overlaps, the catalog centred beside it', () => {
    const leaves = graph.nodes.slice(1).map((node) => node.position.y);
    const steps = leaves.slice(1).map((top, index) => top - (leaves[index] ?? 0));
    expect(steps.slice(0, 2)).toEqual([
      MAP_LAYOUT.storeLeafHeight + MAP_LAYOUT.rowGap,
      MAP_LAYOUT.storeLeafHeight + MAP_LAYOUT.rowGap,
    ]);
    const hub = graph.nodes[0]?.position.y ?? 0;
    expect(hub).toBeGreaterThan(0);
    expect(hub).toBeLessThan(graph.height / 2);
  });

  it('keeps eight compact stores within a column a laptop’s map panel shows whole', () => {
    const eight = [...Array(EIGHT_STORES).keys()].map((index) =>
      storeHealthFixture({}, { connectionId: `c-${index}` }),
    );
    const { height } = buildAccountMap({ stores: eight, productCount: 1, channels: [] });
    expect(height * MAP_LAYOUT.fillMinZoom).toBeLessThan(EIGHT_STORE_PANEL_HEIGHT);
  });

  it('draws a store whose products wait for details in the needs-details colour', () => {
    const waiting = storeHealthFixture({
      [ListingDisplayState.published]: 5,
      [ListingDisplayState.publishing]: 1,
      [ListingDisplayState.needs_details]: 2,
    });
    const { edges } = buildAccountMap({ stores: [waiting], productCount: 8, channels: [] });
    expect(edges[0]?.style?.stroke).toBe(MAP_STATUS_PRESENTATION[MapStatus.NeedsDetails].stroke);
  });

  it('lays a live overlay over its nodes and pulses the edges of stores a change syncs to', () => {
    const overlay = {
      nodes: {
        'c-2': { activity: null, proposals: 2, highlighted: false },
        [CATALOG_NODE_ID]: { activity: null, proposals: 0, highlighted: true },
      },
      pulsingStoreIds: new Set(['c-2']),
    };
    const live = buildAccountMap({ stores, productCount: 8, channels: CHANNELS, overlay });
    expect(live.nodes[0]?.data).toMatchObject({ overlay: { highlighted: true } });
    expect(live.nodes[2]?.data).toMatchObject({ overlay: { proposals: 2 } });
    expect(live.edges[1]).toMatchObject({ animated: true, className: PULSING_EDGE_CLASS });
    expect(live.edges[0]?.className).toBeUndefined();
  });
});
