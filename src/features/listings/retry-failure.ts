import { HttpStatus, statusCodeOf } from '@/api/api-error';
import { RetryFailure } from './listings.constants';

const FAILURES_BY_STATUS: Partial<Record<number, RetryFailure>> = {
  [HttpStatus.Conflict]: RetryFailure.Blocked,
  [HttpStatus.PaymentRequired]: RetryFailure.PlanFull,
  [HttpStatus.Forbidden]: RetryFailure.NotAllowed,
};

/** Why "Try again" failed, from the status the API answered with. */
export function retryFailureOf(error: unknown): RetryFailure {
  const status = statusCodeOf(error);
  return (status !== undefined && FAILURES_BY_STATUS[status]) || RetryFailure.Other;
}
