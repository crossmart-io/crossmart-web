import { toApiErrorMessage } from './api-error';

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
