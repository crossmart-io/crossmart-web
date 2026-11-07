import {
  AccountLookupKind,
  AskCallerType,
  AskChannel,
  AskConfidence,
  AskEscalationReason,
  AskEscalationStatus,
  AskOutcome,
} from '@/api/schema';
import { AskInsightsView, CallbackState, EscalatedFilter } from './ask-insights.types';

export const ASK_CONVERSATIONS_ENDPOINT = '/api/v1/admin/ask/conversations';
export const ASK_CONVERSATION_ENDPOINT = '/api/v1/admin/ask/conversations/{conversationId}';
export const ASK_TOP_QUESTIONS_ENDPOINT = '/api/v1/admin/ask/questions/top';
export const ASK_UNANSWERED_QUESTIONS_ENDPOINT = '/api/v1/admin/ask/questions/unanswered';
export const ASK_ESCALATIONS_ENDPOINT = '/api/v1/admin/ask/escalations';
export const ASK_ESCALATION_REPLY_ENDPOINT = '/api/v1/admin/ask/escalations/{escalationId}/reply';

/** What a reply changes: the escalation lists, the conversation and its row in the table. */
export const ASK_ESCALATION_QUERIES: readonly string[] = [
  ASK_ESCALATIONS_ENDPOINT,
  ASK_CONVERSATION_ENDPOINT,
  ASK_CONVERSATIONS_ENDPOINT,
];

/** How many questions the top and unanswered lists show, and escalations the list shows. */
export const ASK_QUESTION_LIST_LIMIT = 50;
export const ASK_ESCALATION_LIST_LIMIT = 100;

export const ASK_REPLY_MAX_LENGTH = 5000;
export const ASK_REPLY_ROWS = 5;

export const DEFAULT_ASK_INSIGHTS_VIEW = AskInsightsView.Conversations;

export const ASK_INSIGHTS_VIEW_LABELS: Record<AskInsightsView, string> = {
  [AskInsightsView.Conversations]: 'Conversations',
  [AskInsightsView.TopQuestions]: 'Top questions',
  [AskInsightsView.Unanswered]: 'Unanswered',
  [AskInsightsView.Escalations]: 'Escalations',
};

export const ASK_OUTCOME_LABELS: Record<AskOutcome, string> = {
  [AskOutcome.answered]: 'Answered',
  [AskOutcome.unknown]: 'Not answered',
  [AskOutcome.out_of_scope]: 'Out of scope',
};

export const ASK_CONFIDENCE_LABELS: Record<AskConfidence, string> = {
  [AskConfidence.high]: 'High confidence',
  [AskConfidence.medium]: 'Medium confidence',
  [AskConfidence.low]: 'Low confidence',
};

export const ASK_CHANNEL_LABELS: Record<AskChannel, string> = {
  [AskChannel.web_widget]: 'Website widget',
  [AskChannel.app_widget]: 'App widget',
  [AskChannel.api]: 'API',
  [AskChannel.mcp]: 'MCP',
  [AskChannel.agent_worker]: 'Agent Worker',
};

export const ASK_CALLER_TYPE_LABELS: Record<AskCallerType, string> = {
  [AskCallerType.anonymous]: 'Anonymous',
  [AskCallerType.user]: 'Signed-in user',
  [AskCallerType.api_key]: 'API key',
  [AskCallerType.agent]: 'Agent',
};

export const ASK_ESCALATION_REASON_LABELS: Record<AskEscalationReason, string> = {
  [AskEscalationReason.unanswered]: 'Not answered',
  [AskEscalationReason.low_confidence]: 'Low confidence',
  [AskEscalationReason.human_requested]: 'Asked for a person',
  [AskEscalationReason.sales]: 'Sales',
};

export const ASK_ESCALATION_STATUS_LABELS: Record<AskEscalationStatus, string> = {
  [AskEscalationStatus.open]: 'Open',
  [AskEscalationStatus.replied]: 'Replied',
};

export const ACCOUNT_LOOKUP_LABELS: Record<AccountLookupKind, string> = {
  [AccountLookupKind.listing_status]: 'Listing status',
  [AccountLookupKind.plan_usage]: 'Plan and usage',
  [AccountLookupKind.channel_connections]: 'Stores',
  [AccountLookupKind.failed_listings]: 'Failed listings',
};

export const ESCALATED_FILTER_LABELS: Record<EscalatedFilter, string> = {
  [EscalatedFilter.Escalated]: 'Escalated',
  [EscalatedFilter.NotEscalated]: 'Not escalated',
};

/** Open escalations come first in the list; the rest keep the API's newest-first order. */
export const ESCALATION_STATUS_ORDER: Record<AskEscalationStatus, number> = {
  [AskEscalationStatus.open]: 0,
  [AskEscalationStatus.replied]: 1,
};

export const ASK_INSIGHTS_COPY = {
  pageName: 'Ask insights',
  pageDescription:
    'What people ask Ask Crossmart, what it could not answer, and the conversations handed to a person.',
  viewsLabel: 'Ask insights sections',
  anyOutcome: 'All outcomes',
  outcomeFilter: 'Filter by outcome',
  anyChannel: 'All channels',
  channelFilter: 'Filter by channel',
  anyEscalation: 'Escalated or not',
  escalatedFilter: 'Filter by escalation',
  anyStatus: 'All statuses',
  statusFilter: 'Filter by status',
  from: 'From',
  to: 'To',
  clearFilters: 'Clear filters',
  conversationNoun: 'conversation',
  conversationsLoading: 'Loading conversations',
  conversationsLoadFailed: 'Conversations could not be loaded',
  conversationsEmpty: 'No conversations yet.',
  conversationsEmptyFiltered: 'No conversations match these filters.',
  noQuestion: 'No question',
  questionsLoading: 'Loading questions',
  questionsLoadFailed: 'Questions could not be loaded',
  questionsEmpty: 'No questions in this period.',
  unansweredDescription: 'Questions Ask did not answer, or answered unsure, most asked first.',
  topDescription: 'The questions asked most in this period.',
  escalationsLoading: 'Loading escalations',
  escalationsLoadFailed: 'Escalations could not be loaded',
  escalationsEmpty: 'No escalations yet.',
  escalationsEmptyFiltered: 'No escalations with this status.',
  escalatedBadge: 'Escalated',
} as const;

export const ASK_CONVERSATION_COPY = {
  name: 'Conversation',
  notFoundName: 'Conversation not found',
  notFound: 'This conversation does not exist, or it was deleted after 180 days.',
  loadFailed: 'This conversation could not be loaded',
  channel: 'Channel',
  caller: 'Caller',
  workspace: 'Workspace',
  started: 'Started',
  lastActivity: 'Last activity',
  questions: 'Questions',
  turnsHeading: 'Questions and answers',
  escalationsHeading: 'Escalations',
  question: 'Question',
  answer: 'Answer',
  accountLookups: 'Looked up in the account',
  latency: 'Latency',
  model: 'Model',
  cached: 'Cached answer',
  escalationOffered: 'A person was offered',
  noWorkspace: 'None',
} as const;

export const ASK_ESCALATION_COPY = {
  reason: 'Reason',
  status: 'Status',
  contactEmail: 'Contact email',
  noContact: 'No contact',
  callback: 'Callback',
  opened: 'Opened',
  reply: 'Reply',
  repliedBy: 'Replied by',
  replyLabel: 'Your reply',
  replyHint: 'Plain text. It is emailed to the contact and POSTed to the callback as written.',
  replySubmit: 'Send reply',
} as const;

export const CALLBACK_STATE_LABELS: Record<CallbackState, string> = {
  [CallbackState.None]: 'No callback URL',
  [CallbackState.Pending]: 'Not delivered yet',
  [CallbackState.Delivered]: 'Delivered',
  [CallbackState.Failed]: 'Failed',
};

export const ASK_ESCALATION_FEEDBACK = {
  replied: 'Reply sent',
  alreadyReplied: 'Another admin already replied to this escalation.',
} as const;

/** Milliseconds as the conversation view shows them ("1.2 s"). */
export const MS_PER_SECOND = 1000;
