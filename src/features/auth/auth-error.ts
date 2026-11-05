import { isEnumValue } from '@/lib/enum';
import { AUTH_ERROR_MESSAGES, AuthErrorCode, FALLBACK_AUTH_ERROR_MESSAGE } from './auth.constants';

/** The error shape Better Auth's client returns instead of throwing. */
interface AuthClientError {
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

/** A message the user can act on. Unknown codes never leak server wording. */
export function toAuthErrorMessage(code: string | undefined): string {
  return isEnumValue(AuthErrorCode, code) ? AUTH_ERROR_MESSAGES[code] : FALLBACK_AUTH_ERROR_MESSAGE;
}
