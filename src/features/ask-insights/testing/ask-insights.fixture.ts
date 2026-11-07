import {
  AskCallerType,
  AskChannel,
  AskConfidence,
  AskEscalationReason,
  AskEscalationStatus,
  AskOutcome,
} from '@/api/schema';
import type {
  AskConversationDetail,
  AskConversationSummary,
  AskEscalationRecord,
  AskTurn,
} from '../ask-insights.types';

export const CONVERSATION_ID = '6f1c2a5e-8d0b-4f7a-9c3e-1b2d3e4f5a6b';
export const ESCALATION_ID = '0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d';

export function conversationSummaryFixture(
  overrides: Partial<AskConversationSummary> = {},
): AskConversationSummary {
  return {
    id: CONVERSATION_ID,
    channel: AskChannel.app_widget,
    callerType: AskCallerType.user,
    clientName: null,
    workspaceId: 'ws-1',
    turnCount: 2,
    firstQuestion: 'How do I connect my Shopify store?',
    lastOutcome: AskOutcome.answered,
    escalated: false,
    createdAt: '2026-11-06T10:00:00Z',
    lastActivityAt: '2026-11-06T10:05:00Z',
    ...overrides,
  };
}

export function turnFixture(overrides: Partial<AskTurn> = {}): AskTurn {
  return {
    id: 'turn-1',
    position: 1,
    question: 'How do I connect my Shopify store?',
    answer: 'Open Channels, pick Shopify, and approve the app in your store.',
    outcome: AskOutcome.answered,
    confidence: AskConfidence.high,
    citations: [
      { title: 'Channels › Shopify', url: 'https://docs.crossmart.io/channels/shopify/' },
    ],
    accountLookups: [],
    escalationReason: null,
    latencyMs: 1240,
    model: 'claude-haiku',
    cached: false,
    createdAt: '2026-11-06T10:00:00Z',
    ...overrides,
  };
}

export function escalationFixture(
  overrides: Partial<AskEscalationRecord> = {},
): AskEscalationRecord {
  return {
    id: ESCALATION_ID,
    conversationId: CONVERSATION_ID,
    reason: AskEscalationReason.unanswered,
    status: AskEscalationStatus.open,
    contactEmail: 'dana@example.com',
    callbackUrl: null,
    reply: null,
    repliedAt: null,
    repliedBy: null,
    callbackDeliveredAt: null,
    callbackError: null,
    createdAt: '2026-11-06T10:06:00Z',
    ...overrides,
  };
}

export function conversationDetailFixture(
  overrides: Partial<AskConversationDetail> = {},
): AskConversationDetail {
  return {
    ...conversationSummaryFixture({ escalated: true }),
    turns: [turnFixture()],
    escalations: [escalationFixture()],
    ...overrides,
  };
}
