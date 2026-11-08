import {
  ActivityActorType,
  WorkspaceEventCategory,
  WorkspaceEventSeverity,
  WorkspaceEventType,
} from '@/api/schema';
import type { WorkspaceEvent } from '../agent-console.types';

/** A listing an eBay store refused, unless the overrides say otherwise. */
export function workspaceEventFixture(overrides: Partial<WorkspaceEvent> = {}): WorkspaceEvent {
  return {
    id: 'activity:1',
    cursor: 'cursor-1',
    type: WorkspaceEventType.listing_failed,
    category: WorkspaceEventCategory.stores,
    severity: WorkspaceEventSeverity.error,
    summary: 'Could not sync “Mug” on eBay',
    detail: 'Item specific Brand is missing',
    actor: { type: ActivityActorType.SYSTEM, name: null, agentName: null, approvedByName: null },
    refs: {
      connectionId: 'c-ebay',
      productId: 'p-mug',
      orderId: null,
      webhookEndpointId: null,
      conversationId: null,
      actionId: null,
      proposalId: null,
    },
    itemCount: null,
    occurredAt: '2026-11-08T10:00:00.000Z',
    ...overrides,
  };
}
