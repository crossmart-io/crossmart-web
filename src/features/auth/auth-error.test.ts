import { AUTH_ERROR_MESSAGES, AuthErrorCode, FALLBACK_AUTH_ERROR_MESSAGE } from './auth.constants';
import { AuthRequestError, toAuthErrorMessage } from './auth-error';

describe('toAuthErrorMessage', () => {
  it('maps a known Better Auth code to its message', () => {
    expect(toAuthErrorMessage(AuthErrorCode.InvalidCredentials)).toBe(
      AUTH_ERROR_MESSAGES[AuthErrorCode.InvalidCredentials],
    );
  });

  it('falls back for unknown or missing codes', () => {
    expect(toAuthErrorMessage('SOMETHING_NEW')).toBe(FALLBACK_AUTH_ERROR_MESSAGE);
    expect(toAuthErrorMessage(undefined)).toBe(FALLBACK_AUTH_ERROR_MESSAGE);
  });
});

describe('AuthRequestError', () => {
  it('keeps the code and uses the readable message', () => {
    const error = AuthRequestError.from({ code: AuthErrorCode.UserAlreadyExists, message: 'raw' });
    expect(error.code).toBe(AuthErrorCode.UserAlreadyExists);
    expect(error.message).toBe(AUTH_ERROR_MESSAGES[AuthErrorCode.UserAlreadyExists]);
  });
});
