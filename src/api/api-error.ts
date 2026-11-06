const FALLBACK_API_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/** Shown when the API cannot be reached at all, instead of the browser's "Failed to fetch". */
export const OFFLINE_ERROR_MESSAGE =
  'Crossmart could not be reached. Check your connection and try again.';

/** Shown for a missing permission, instead of the API's "Requires the products:edit permission". */
export const FORBIDDEN_ERROR_MESSAGE =
  'Your role does not allow this. Ask a workspace owner or admin for access.';

export const RATE_LIMITED_ERROR_MESSAGE = 'Too many requests — try again in a moment.';

export enum HttpStatus {
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  TooManyRequests = 429,
  ServiceUnavailable = 503,
}

/**
 * What browsers say when a request never reached the server: Chromium, Firefox and Safari.
 * `fetch` rejects with a TypeError carrying one of these.
 */
const NETWORK_ERROR_MESSAGES: readonly string[] = [
  'Failed to fetch',
  'NetworkError when attempting to fetch resource.',
  'Load failed',
];

/** The API's message for a role without the permission, which names an internal key. */
const MISSING_PERMISSION_PATTERN = /^Requires the \S+ permission$/;

/** The request never reached the API: offline, DNS, CORS, or the server is down. */
export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && NETWORK_ERROR_MESSAGES.includes(error.message);
}

/** NestJS error bodies carry `message` as a string, or a list of validation messages. */
function messageOf(error: unknown): string {
  if (typeof error !== 'object' || error === null || !('message' in error)) {
    return FALLBACK_API_ERROR_MESSAGE;
  }
  const { message } = error;
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) return message.filter((line) => typeof line === 'string').join('. ');
  return FALLBACK_API_ERROR_MESSAGE;
}

/** A 403 keeps its message when it explains itself; a bare permission key is replaced. */
function forbiddenMessage(message: string): string {
  return MISSING_PERMISSION_PATTERN.test(message) || message === 'Forbidden'
    ? FORBIDDEN_ERROR_MESSAGE
    : message;
}

/** The message to show for a failed API call, in words a seller understands. */
export function toApiErrorMessage(error: unknown): string {
  if (isNetworkError(error)) return OFFLINE_ERROR_MESSAGE;
  const status = statusCodeOf(error);
  if (status === HttpStatus.TooManyRequests) return RATE_LIMITED_ERROR_MESSAGE;
  const message = messageOf(error);
  return status === HttpStatus.Forbidden ? forbiddenMessage(message) : message;
}

/** The HTTP status of an API error body or an `ApiRequestError`, when it reports one. */
export function statusCodeOf(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('statusCode' in error)) return undefined;
  return typeof error.statusCode === 'number' ? error.statusCode : undefined;
}

/** The session expired or the API key was revoked. */
export function isUnauthorizedError(error: unknown): boolean {
  return statusCodeOf(error) === HttpStatus.Unauthorized;
}

export function isNotFoundError(error: unknown): boolean {
  return statusCodeOf(error) === HttpStatus.NotFound;
}

/** The machine-readable `code` an API error body or an `ApiRequestError` carries, if any. */
export function errorCodeOf(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('code' in error)) return undefined;
  return typeof error.code === 'string' ? error.code : undefined;
}

/**
 * A failed API call, with the message to show, the HTTP status the API reported, and the
 * error's `code` when the API names one, so a caller can tell two errors of a status apart.
 */
export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }

  /** `status` is the response's, for bodies that do not carry their own `statusCode`. */
  static from(body: unknown, status?: number): ApiRequestError {
    const statusCode = statusCodeOf(body) ?? status;
    const message = toApiErrorMessage(
      typeof body === 'object' && body !== null ? { statusCode, ...body } : { statusCode },
    );
    return new ApiRequestError(message, statusCode, errorCodeOf(body));
  }
}
