import {
  ApiRequestError,
  FORBIDDEN_ERROR_MESSAGE,
  isNetworkError,
  OFFLINE_ERROR_MESSAGE,
  RATE_LIMITED_ERROR_MESSAGE,
  isNotFoundError,
  isUnauthorizedError,
  statusCodeOf,
  toApiErrorMessage,
} from './api-error';

describe('toApiErrorMessage', () => {
  it('reads a NestJS message', () => {
    expect(toApiErrorMessage({ statusCode: 400, message: 'Bad file' })).toBe('Bad file');
  });

  it('joins validation messages', () => {
    expect(toApiErrorMessage({ message: ['a is wrong', 'b is wrong'] })).toBe(
      'a is wrong. b is wrong',
    );
  });

  it('falls back for anything else', () => {
    expect(toApiErrorMessage(null)).toMatch(/went wrong/);
  });

  it('says the API is unreachable instead of the browser network error', () => {
    expect(toApiErrorMessage(new TypeError('Failed to fetch'))).toBe(OFFLINE_ERROR_MESSAGE);
    expect(toApiErrorMessage(new TypeError('Load failed'))).toBe(OFFLINE_ERROR_MESSAGE);
    expect(isNetworkError(new TypeError('x is undefined'))).toBe(false);
  });

  it('replaces a missing permission key with plain words', () => {
    const body = { statusCode: 403, message: 'Requires the products:edit permission' };
    expect(toApiErrorMessage(body)).toBe(FORBIDDEN_ERROR_MESSAGE);
  });

  it('keeps a 403 message that explains itself', () => {
    const message = 'A role cannot have more access than you have';
    expect(toApiErrorMessage({ statusCode: 403, message })).toBe(message);
  });

  it('asks to wait after a rate limit', () => {
    expect(toApiErrorMessage({ statusCode: 429, message: 'ThrottlerException' })).toBe(
      RATE_LIMITED_ERROR_MESSAGE,
    );
  });
});

describe('ApiRequestError', () => {
  it('keeps the message and the status of the API body', () => {
    const error = ApiRequestError.from({ statusCode: 401, message: 'Unauthorized' });

    expect(error.message).toBe('Unauthorized');
    expect(isUnauthorizedError(error)).toBe(true);
    expect(isNotFoundError(error)).toBe(false);
  });

  it('takes the response status when the body has none', () => {
    const error = ApiRequestError.from(undefined, 429);

    expect(error.statusCode).toBe(429);
    expect(error.message).toBe(RATE_LIMITED_ERROR_MESSAGE);
  });

  it('recognises a raw 404 body', () => {
    expect(isNotFoundError({ statusCode: 404, message: 'Product not found' })).toBe(true);
    expect(statusCodeOf(new TypeError('Failed to fetch'))).toBeUndefined();
  });
});
