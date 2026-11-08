import { ActivityActorType, WorkspaceEventCategory, WorkspaceEventSeverity } from '@/api/schema';
import { CATALOG_NODE_ID } from '@/features/channel-map';
import { EventFilter } from './agent-console.constants';
import { mergeEvents } from './event-buffer';
import { matchesFilter } from './event-filters';
import { actorLabel, eventNodeId, eventRoute } from './event-presentation';
import { workspaceEventFixture } from './testing/workspace-event.fixture';

const NO_REFS = workspaceEventFixture({
  refs: {
    connectionId: null,
    productId: null,
    orderId: null,
    webhookEndpointId: null,
    conversationId: null,
    actionId: null,
    proposalId: null,
  },
});

describe('mergeEvents', () => {
  it('adds new events in time order, each once, keeping the newest', () => {
    const first = workspaceEventFixture({ id: 'a', occurredAt: '2026-11-08T10:00:00.000Z' });
    const second = workspaceEventFixture({ id: 'b', occurredAt: '2026-11-08T10:00:01.000Z' });
    const third = workspaceEventFixture({ id: 'c', occurredAt: '2026-11-08T10:00:02.000Z' });

    expect(mergeEvents([first], [third, second, first], 10).map(({ id }) => id)).toEqual([
      'a',
      'b',
      'c',
    ]);
    expect(mergeEvents([first, second], [third], 2).map(({ id }) => id)).toEqual(['b', 'c']);
  });

  it('keeps the same list when nothing is new, so nothing re-renders', () => {
    const kept = [workspaceEventFixture()];
    expect(mergeEvents(kept, [workspaceEventFixture()], 10)).toBe(kept);
  });
});

describe('matchesFilter', () => {
  const order = workspaceEventFixture({
    category: WorkspaceEventCategory.orders,
    severity: WorkspaceEventSeverity.success,
  });

  it('filters by category, and errors of any kind', () => {
    expect(matchesFilter(order, EventFilter.Orders)).toBe(true);
    expect(matchesFilter(order, EventFilter.Stores)).toBe(false);
    expect(matchesFilter(order, EventFilter.Errors)).toBe(false);
    expect(matchesFilter(workspaceEventFixture(), EventFilter.Errors)).toBe(true);
    expect(matchesFilter(order, EventFilter.All)).toBe(true);
  });
});

describe('event presentation', () => {
  it('names an agent with the person it acted for, an API key, or Crossmart itself', () => {
    const agent = {
      type: ActivityActorType.AGENT,
      name: 'Dana',
      agentName: 'Claude',
      approvedByName: null,
    };
    const approved = { ...agent, approvedByName: 'Lee' };
    const key = {
      type: ActivityActorType.API_KEY,
      name: 'n8n',
      agentName: null,
      approvedByName: null,
    };
    expect(actorLabel(workspaceEventFixture({ actor: agent }))).toBe('Claude for Dana');
    expect(actorLabel(workspaceEventFixture({ actor: approved }))).toBe(
      'Claude for Dana, approved by Lee',
    );
    expect(actorLabel(workspaceEventFixture({ actor: key }))).toBe('n8n');
    expect(actorLabel(workspaceEventFixture())).toBe('Crossmart');
  });

  it('points at the store, else the catalog for a product, else nothing', () => {
    expect(eventNodeId(workspaceEventFixture())).toBe('c-ebay');
    expect(eventNodeId({ ...NO_REFS, refs: { ...NO_REFS.refs, productId: 'p-1' } })).toBe(
      CATALOG_NODE_ID,
    );
    expect(eventNodeId(NO_REFS)).toBeNull();
  });

  it('leads to the most specific page', () => {
    expect(eventRoute(workspaceEventFixture())).toBe('/products/p-mug');
    expect(eventRoute({ ...NO_REFS, refs: { ...NO_REFS.refs, orderId: 'o-1' } })).toBe(
      '/orders/o-1',
    );
    expect(eventRoute({ ...NO_REFS, refs: { ...NO_REFS.refs, connectionId: 'c-1' } })).toBe(
      '/channels/c-1',
    );
    expect(eventRoute(NO_REFS)).toBeNull();
  });

  it('opens an outside agent’s proposal where it can be decided', () => {
    const proposal = {
      ...NO_REFS,
      refs: { ...NO_REFS.refs, proposalId: 'pr-1', productId: 'p-1' },
    };
    expect(eventRoute(proposal)).toBe('/agent-proposals');
  });
});
