import {
  ApiRequestError,
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
    expect(toApiErrorMessage(new TypeError('Failed to fetch'))).toBe('Failed to fetch');
    expect(toApiErrorMessage(null)).toMatch(/went wrong/);
  });
});

describe('ApiRequestError', () => {
  it('keeps the message and the status of the API body', () => {
    const error = ApiRequestError.from({ statusCode: 401, message: 'Unauthorized' });

    expect(error.message).toBe('Unauthorized');
    expect(isUnauthorizedError(error)).toBe(true);
    expect(isNotFoundError(error)).toBe(false);
  });

  it('recognises a raw 404 body', () => {
    expect(isNotFoundError({ statusCode: 404, message: 'Product not found' })).toBe(true);
    expect(statusCodeOf(new TypeError('Failed to fetch'))).toBeUndefined();
  });
});
