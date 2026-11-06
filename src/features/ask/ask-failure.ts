import {
  HttpStatus,
  isNetworkError,
  OFFLINE_ERROR_MESSAGE,
  statusCodeOf,
  toApiErrorMessage,
} from '@/api/api-error';
import { ASK_RATE_LIMITED_DETAIL } from './ask.constants';
import { AskFailure, type AskFailureDetails } from './ask.types';

function failureOf(error: unknown): AskFailure {
  if (isNetworkError(error)) return AskFailure.Offline;
  switch (statusCodeOf(error)) {
    case HttpStatus.TooManyRequests:
      return AskFailure.RateLimited;
    case HttpStatus.ServiceUnavailable:
      return AskFailure.Unavailable;
    default:
      return AskFailure.Failed;
  }
}

function messageFor(failure: AskFailure, error: unknown): string {
  if (failure === AskFailure.RateLimited) return ASK_RATE_LIMITED_DETAIL;
  if (failure === AskFailure.Offline) return OFFLINE_ERROR_MESSAGE;
  return error instanceof Error ? error.message : toApiErrorMessage(error);
}

/**
 * Why a question failed, in words for the panel. A 503 keeps the API's message, which says
 * whether Ask is off or today's questions are spent, and where to write instead.
 */
export function toAskFailure(error: unknown): AskFailureDetails {
  const failure = failureOf(error);
  return { failure, message: messageFor(failure, error) };
}
