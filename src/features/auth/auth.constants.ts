/** Mirrors the API's minimum so the form can say so before a round trip. */
export const MIN_PASSWORD_LENGTH = 10;

export enum AuthErrorCode {
  InvalidCredentials = 'INVALID_EMAIL_OR_PASSWORD',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UserAlreadyExistsUseAnotherEmail = 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
  InvalidEmail = 'INVALID_EMAIL',
  PasswordTooShort = 'PASSWORD_TOO_SHORT',
  PasswordTooLong = 'PASSWORD_TOO_LONG',
  InvalidToken = 'INVALID_TOKEN',
}

const EMAIL_TAKEN_MESSAGE = 'An account with this email already exists. Sign in instead.';

export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  [AuthErrorCode.InvalidCredentials]: 'That email and password do not match.',
  [AuthErrorCode.UserAlreadyExists]: EMAIL_TAKEN_MESSAGE,
  [AuthErrorCode.UserAlreadyExistsUseAnotherEmail]: EMAIL_TAKEN_MESSAGE,
  [AuthErrorCode.InvalidEmail]: 'Enter a valid email address.',
  [AuthErrorCode.PasswordTooShort]: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
  [AuthErrorCode.PasswordTooLong]: 'That password is too long.',
  [AuthErrorCode.InvalidToken]: 'This link has expired or was already used. Ask for a new one.',
};

export const FALLBACK_AUTH_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/** Form field names, shared by the inputs and the code that reads the submitted form. */
export enum AuthField {
  Name = 'name',
  Email = 'email',
  Password = 'password',
}

/** Query parameters Better Auth adds when it sends someone back to the web app. */
export const AUTH_LINK_QUERY = {
  token: 'token',
  error: 'error',
} as const;

/** Where emailed links land, as absolute URLs for the API to redirect to. */
export function toAppUrl(path: string): string {
  return new URL(path, window.location.origin).toString();
}

/** The legal pages on crossmart.io that signing up accepts. */
export const LEGAL_LINKS = {
  terms: 'https://crossmart.io/terms',
  privacy: 'https://crossmart.io/privacy',
} as const;

/** Shown when the session could not be checked, such as while offline or the API is down. */
export const SESSION_UNAVAILABLE_TITLE = 'Crossmart could not check your sign-in';
