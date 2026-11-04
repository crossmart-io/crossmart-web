import { AUTH_ERROR_MESSAGES, AuthErrorCode, FALLBACK_AUTH_ERROR_MESSAGE } from './auth.constants';

/** The error shape Better Auth's client returns instead of throwing. */
export interface AuthClientError {
  code?: string;
  message?: string;
}

/** Thrown by the auth mutations so TanStack Query can surface a readable message. */
export class AuthRequestError extends Error {
  constructor(readonly code: string | undefined) {
    super(toAuthErrorMessage(code));
    this.name = 'AuthRequestError';
  }

  static from(error: AuthClientError): AuthRequestError {
    return new AuthRequestError(error.code);
  }
}

function isAuthErrorCode(code: string): code is AuthErrorCode {
  return Object.values<string>(AuthErrorCode).includes(code);
}

/** A message the user can act on. Unknown codes never leak server wording. */
export function toAuthErrorMessage(code: string | undefined): string {
  return code && isAuthErrorCode(code) ? AUTH_ERROR_MESSAGES[code] : FALLBACK_AUTH_ERROR_MESSAGE;
}
