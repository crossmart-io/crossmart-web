import { ApiRequestError } from '@/api/api-error';
import { ListingRetryErrorCode } from '@/api/schema';
import { RetryFailure } from './listings.constants';
import { retryFailureOf } from './retry-failure';

describe('retryFailureOf', () => {
  it.each([
    [409, RetryFailure.Blocked],
    [402, RetryFailure.PlanFull],
    [403, RetryFailure.NotAllowed],
    [500, RetryFailure.Other],
  ])('reads a %i as %s', (status, failure) => {
    expect(retryFailureOf(new ApiRequestError('No', status))).toBe(failure);
  });

  it.each([
    [ListingRetryErrorCode.store_not_connected, RetryFailure.StoreNotConnected],
    [ListingRetryErrorCode.product_not_in_store, RetryFailure.NotInStore],
  ])('tells a 409 for %s apart', (code, failure) => {
    expect(retryFailureOf(new ApiRequestError('Conflict', 409, code))).toBe(failure);
  });

  it('keeps an unknown 409 code as a generic block', () => {
    expect(retryFailureOf(new ApiRequestError('Conflict', 409, 'something_new'))).toBe(
      RetryFailure.Blocked,
    );
  });

  it('treats an error without a status as another failure', () => {
    expect(retryFailureOf(new TypeError('Failed to fetch'))).toBe(RetryFailure.Other);
  });
});
