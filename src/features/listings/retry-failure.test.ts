import { ApiRequestError } from '@/api/api-error';
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

  it('treats an error without a status as another failure', () => {
    expect(retryFailureOf(new TypeError('Failed to fetch'))).toBe(RetryFailure.Other);
  });
});
