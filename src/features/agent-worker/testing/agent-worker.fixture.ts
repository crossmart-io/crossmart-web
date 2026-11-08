import {
  AgentWorkerActionStatus,
  AgentWorkerRole,
  AgentWorkerToolKind,
  AgentWorkerTurnStatus,
  AgentWorkerTurnTrigger,
} from '@/api/schema';
import type {
  AgentWorkerAction,
  AgentWorkerMessage,
  AgentWorkerStreamEvent,
  AgentWorkerTurn,
} from '../agent-worker.types';

const CREATED_AT = '2026-11-08T10:00:00.000Z';

/** A change Agent Worker waits to make: a new title for the Linen Shirt on the Outlet store. */
export function actionFixture(overrides: Partial<AgentWorkerAction> = {}): AgentWorkerAction {
  return {
    id: 'a-1',
    messageId: 'm-2',
    toolName: 'override_store_listing',
    toolTitle: 'Override fields of a listing',
    kind: AgentWorkerToolKind.write,
    status: AgentWorkerActionStatus.proposed,
    summary: 'Change the title of Linen Shirt on Outlet store',
    risks: [],
    preview: {
      target: 'Linen Shirt on Outlet store',
      headline: 'Change how this product shows on Outlet store only',
      details: [],
      changes: [{ label: 'Title', before: 'Linen Shirt', after: 'Linen Shirt, Relaxed Fit' }],
    },
    outcome: null,
    isError: false,
    untrustedWarning: false,
    decidedAt: null,
    executedAt: null,
    createdAt: CREATED_AT,
    ...overrides,
  };
}

export function messageFixture(overrides: Partial<AgentWorkerMessage> = {}): AgentWorkerMessage {
  return {
    id: 'm-1',
    turnId: 't-1',
    role: AgentWorkerRole.user,
    text: 'Fix my failed eBay listings',
    actions: [],
    createdAt: CREATED_AT,
    ...overrides,
  };
}

export function turnFixture(overrides: Partial<AgentWorkerTurn> = {}): AgentWorkerTurn {
  return {
    id: 't-1',
    trigger: AgentWorkerTurnTrigger.message,
    status: AgentWorkerTurnStatus.running,
    modelCalls: 1,
    inputTokens: 0,
    outputTokens: 0,
    failureReason: null,
    startedAt: CREATED_AT,
    finishedAt: null,
    ...overrides,
  };
}

/** An event stream's text, as the API writes it, with a heartbeat first. */
export function eventStreamText(events: readonly AgentWorkerStreamEvent[]): string {
  const body = events.map((event) => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
  return [': heartbeat\n\n', ...body].join('');
}
