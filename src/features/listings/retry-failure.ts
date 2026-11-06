import { errorCodeOf, HttpStatus, statusCodeOf } from '@/api/api-error';
import { ListingRetryErrorCode } from '@/api/schema';
import { RetryFailure } from './listings.constants';

const FAILURES_BY_STATUS: Partial<Record<number, RetryFailure>> = {
  [HttpStatus.Conflict]: RetryFailure.Blocked,
  [HttpStatus.PaymentRequired]: RetryFailure.PlanFull,
  [HttpStatus.Forbidden]: RetryFailure.NotAllowed,
};

/** What a 409 says was in the way, by the code the API gave it. */
const CONFLICTS_BY_CODE: Record<ListingRetryErrorCode, RetryFailure> = {
  [ListingRetryErrorCode.store_not_connected]: RetryFailure.StoreNotConnected,
  [ListingRetryErrorCode.product_not_in_store]: RetryFailure.NotInStore,
};

function isRetryErrorCode(code: string | undefined): code is ListingRetryErrorCode {
  return Object.values<string | undefined>(ListingRetryErrorCode).includes(code);
}

/** Why "Try again" failed, from the status the API answered with and, for a 409, its code. */
export function retryFailureOf(error: unknown): RetryFailure {
  const status = statusCodeOf(error);
  const code = errorCodeOf(error);
  if (status === HttpStatus.Conflict && isRetryErrorCode(code)) return CONFLICTS_BY_CODE[code];
  return (status !== undefined && FAILURES_BY_STATUS[status]) || RetryFailure.Other;
}
