import type { components } from '@/api/schema';

export type AskConversationSummary = components['schemas']['AskConversationSummaryDto'];
export type AskConversationPage = components['schemas']['AskConversationPageDto'];
export type AskConversationDetail = components['schemas']['AskConversationDetailDto'];
export type AskTurn = components['schemas']['AskTurnDto'];
export type AskEscalationRecord = components['schemas']['AskEscalationRecordDto'];
export type AskQuestionCount = components['schemas']['AskQuestionCountDto'];

/** The sections of the Ask insights page, as the `view` query parameter names them. */
export enum AskInsightsView {
  Conversations = 'conversations',
  TopQuestions = 'top',
  Unanswered = 'unanswered',
  Escalations = 'escalations',
}

/** The conversations table's escalation filter, as the `escalated` query parameter says it. */
export enum EscalatedFilter {
  Escalated = 'true',
  NotEscalated = 'false',
}

/** A period as two calendar days (`YYYY-MM-DD`), both included; either end may be open. */
export interface DayRange {
  from?: string;
  to?: string;
}

/** Where an escalation's signed callback stands. */
export enum CallbackState {
  None = 'none',
  Pending = 'pending',
  Delivered = 'delivered',
  Failed = 'failed',
}
