import type { components } from '@/api/schema';

export type AskAnswer = components['schemas']['AskAnswerDto'];
export type AskCitation = components['schemas']['AskCitationDto'];

/** Where one question stands. */
export enum AskExchangeStatus {
  Pending = 'pending',
  Answered = 'answered',
  Failed = 'failed',
}

/** Why a question got no answer. */
export enum AskFailure {
  RateLimited = 'rate_limited',
  Unavailable = 'unavailable',
  Offline = 'offline',
  Failed = 'failed',
}

export interface AskFailureDetails {
  failure: AskFailure;
  message: string;
}

/** One question and its reply, kept in memory for as long as the app is open. */
export type AskExchange = { id: number; question: string } & (
  | { status: AskExchangeStatus.Pending }
  | { status: AskExchangeStatus.Answered; answer: AskAnswer }
  | ({ status: AskExchangeStatus.Failed } & AskFailureDetails)
);
