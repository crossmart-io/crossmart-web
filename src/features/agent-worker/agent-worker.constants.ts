import { AgentWorkerActionRisk, AgentWorkerActionStatus } from '@/api/schema';

export const AGENT_WORKER_CONVERSATIONS_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/agent-worker/conversations';
export const AGENT_WORKER_CONVERSATION_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/agent-worker/conversations/{conversationId}';
export const AGENT_WORKER_MESSAGES_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/agent-worker/conversations/{conversationId}/messages';
export const AGENT_WORKER_DECISION_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/agent-worker/conversations/{conversationId}/decision';
export const AGENT_WORKER_CANCEL_ENDPOINT =
  '/api/v1/workspaces/{workspaceId}/agent-worker/conversations/{conversationId}/cancel';

/** What a stream ends up changing in the cache: the conversation and the list of them. */
export const AGENT_WORKER_REFRESHED_ENDPOINTS = [
  AGENT_WORKER_CONVERSATIONS_ENDPOINT,
  AGENT_WORKER_CONVERSATION_ENDPOINT,
] as const;

/** Conversations listed in the history switcher. */
export const AGENT_WORKER_HISTORY_LIMIT = 20;

/** The message length the API accepts. */
export const AGENT_WORKER_MESSAGE_MAX_LENGTH = 4000;

/** Cmd+J on macOS, Ctrl+J elsewhere, opens Crossmart Agent. */
export const AGENT_WORKER_SHORTCUT_KEY = 'j';

/** Values up to this long, on one line, read as "before → after" instead of a word diff. */
export const INLINE_CHANGE_MAX_LENGTH = 60;

/** Prompts offered in an empty conversation. */
export const AGENT_WORKER_EXAMPLE_PROMPTS = [
  'Fix my failed eBay listings',
  'Publish the Linen Shirt to my Outlet store',
  'Which products are low on stock?',
  'Shorten titles for eBay’s 80-character limit',
] as const;

/** Hooks for end-to-end tests and screenshots. */
export const AGENT_WORKER_TEST_IDS = {
  launcher: 'agent-worker-launcher',
  channelMapButton: 'channel-map-ask-agent-worker',
  productMapButton: 'product-map-ask-agent-worker',
  storeFixButton: 'store-fix-with-agent-worker',
  composer: 'agent-worker-composer',
  send: 'agent-worker-send',
  stop: 'agent-worker-stop',
  proposedCard: 'agent-worker-proposed-actions',
  approve: 'agent-worker-approve',
  chat: 'agent-chat',
  rejectAll: 'agent-worker-reject-all',
} as const;

/** The element ids the page scrolls to, such as the changes waiting for review. */
export const AGENT_WORKER_ELEMENT_IDS = {
  proposedCard: 'agent-proposed-changes',
} as const;

export const AGENT_WORKER_COPY = {
  name: 'Crossmart Agent',
  open: 'Ask Crossmart Agent',
  openInAgent: 'Open in Crossmart Agent',
  fixStore: 'Fix with Crossmart Agent',
  fixStorePrompt: (store: string) => `Fix the failed listings on ${store}`,
  description:
    'An AI agent that works in your workspace. It reads right away and asks before it changes anything.',
  history: 'Conversations',
  historyEmpty: 'No conversations yet',
  newConversation: 'New conversation',
  pendingCount: (count: number) => (count === 1 ? '1 change waiting' : `${count} changes waiting`),
  examplesLabel: 'Try asking',
  emptyTitle: 'What should Crossmart Agent do?',
  composerLabel: 'Message Crossmart Agent',
  composerPlaceholder: 'Ask Crossmart Agent to check, fix or publish something…',
  keyboardHint: 'to send, Shift + Enter for a new line',
  send: 'Send',
  stop: 'Stop',
  working: 'Working…',
  you: 'You',
  logLabel: 'Conversation with Crossmart Agent',
  loadError: 'This conversation could not be loaded.',
  proposedTitle: 'Review the changes',
  proposedDescription: 'Crossmart Agent makes only the changes you approve.',
  approveSelected: 'Approve selected',
  rejectAll: 'Reject all',
  untrustedWarning: 'Text read in this turn looked like instructions; review carefully',
  changeTarget: 'On',
  before: 'Now',
  after: 'After',
  empty: '(empty)',
  /** Between a value before and after, for short values such as prices. */
  changesTo: 'changes to',
  confirmRisk: (consequences: string) => `I understand this ${consequences}`,
  stoppedNote: 'Stopped.',
} as const;

/** Words for each risk: a badge on the change, and part of the confirmation sentence. */
export const AGENT_WORKER_RISK_COPY: Record<
  AgentWorkerActionRisk,
  { label: string; consequence: string }
> = {
  [AgentWorkerActionRisk.destructive]: { label: 'Deletes', consequence: 'deletes' },
  [AgentWorkerActionRisk.price_change]: { label: 'Changes prices', consequence: 'changes prices' },
  [AgentWorkerActionRisk.bulk]: { label: 'Many items', consequence: 'changes many items' },
};

/** How an action's status reads once it is no longer waiting for a decision. */
export enum ActionTone {
  Neutral = 'neutral',
  Busy = 'busy',
  Success = 'success',
  Failure = 'failure',
}

export const AGENT_WORKER_ACTION_STATUS_COPY: Record<
  AgentWorkerActionStatus,
  { label: string; tone: ActionTone }
> = {
  [AgentWorkerActionStatus.running]: { label: 'Running', tone: ActionTone.Busy },
  [AgentWorkerActionStatus.succeeded]: { label: 'Done', tone: ActionTone.Success },
  [AgentWorkerActionStatus.failed]: { label: 'Failed', tone: ActionTone.Failure },
  [AgentWorkerActionStatus.proposed]: { label: 'Waiting for you', tone: ActionTone.Neutral },
  [AgentWorkerActionStatus.refused]: { label: 'Refused', tone: ActionTone.Failure },
  [AgentWorkerActionStatus.rejected]: { label: 'Rejected', tone: ActionTone.Neutral },
  [AgentWorkerActionStatus.expired]: { label: 'Expired', tone: ActionTone.Neutral },
  [AgentWorkerActionStatus.cancelled]: { label: 'Cancelled', tone: ActionTone.Neutral },
  [AgentWorkerActionStatus.executing]: { label: 'Applying', tone: ActionTone.Busy },
  [AgentWorkerActionStatus.executed]: { label: 'Applied', tone: ActionTone.Success },
  [AgentWorkerActionStatus.execution_failed]: { label: 'Failed', tone: ActionTone.Failure },
};
