import { AgentWorkerActionStatus, AgentWorkerToolKind } from '@/api/schema';
import { actionFixture } from '@/features/agent-worker/testing/agent-worker.fixture';
import { CATALOG_NODE_ID, NodeActivityTone } from '@/features/channel-map';
import { buildMapOverlay, hasActivity } from './map-overlay';

const read = actionFixture({
  id: 'r-1',
  kind: AgentWorkerToolKind.read,
  toolTitle: 'List a store’s products by state',
  status: AgentWorkerActionStatus.running,
  targets: { connectionIds: ['c-ebay'], productIds: [] },
});

function overlayOf(input: Partial<Parameters<typeof buildMapOverlay>[0]>) {
  return buildMapOverlay({
    actions: [],
    proposed: [],
    pulsingStoreIds: new Set(),
    highlightedNodeId: null,
    onOpenProposals: vi.fn<() => void>(),
    ...input,
  });
}

describe('buildMapOverlay', () => {
  it('shows a read on the store it names, and a catalog-wide one on the catalog', () => {
    const overlay = overlayOf({
      actions: [read, { ...read, id: 'r-2', targets: { connectionIds: [], productIds: [] } }],
    });
    expect(overlay.nodes['c-ebay']?.activity).toEqual({
      label: 'Reading: List a store’s products by state',
      tone: NodeActivityTone.Reading,
    });
    expect(overlay.nodes[CATALOG_NODE_ID]?.activity?.tone).toBe(NodeActivityTone.Reading);
  });

  it('counts proposals on their store with a marker and words, behind stronger work', () => {
    const proposed = [actionFixture(), actionFixture({ id: 'a-2' })];
    const waiting = overlayOf({ proposed });
    expect(waiting.nodes['c-outlet']).toMatchObject({
      proposals: 2,
      activity: { label: 'Proposed: 2 changes', tone: NodeActivityTone.Waiting },
    });
    const updating = actionFixture({ id: 'a-3', status: AgentWorkerActionStatus.executing });
    const busy = overlayOf({ proposed, actions: [updating] });
    expect(busy.nodes['c-outlet']?.activity?.tone).toBe(NodeActivityTone.Writing);
    expect(busy.nodes['c-outlet']?.activity?.label).toBe(
      'Updating: Change how this product shows on Outlet store only',
    );
  });

  it('rings the node an event points at, and tells whether the agent is at work', () => {
    const idle = overlayOf({ highlightedNodeId: 'c-ebay' });
    expect(idle.nodes['c-ebay']?.highlighted).toBe(true);
    expect(hasActivity(idle)).toBe(false);
    expect(hasActivity(overlayOf({ actions: [read] }))).toBe(true);
    expect(hasActivity(overlayOf({ pulsingStoreIds: new Set(['c-ebay']) }))).toBe(true);
  });

  it('shows nothing for a change that was rejected', () => {
    const rejected = actionFixture({ status: AgentWorkerActionStatus.rejected });
    expect(overlayOf({ actions: [rejected] }).nodes).toEqual({});
  });
});
