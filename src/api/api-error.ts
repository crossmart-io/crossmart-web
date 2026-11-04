const FALLBACK_API_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export enum HttpStatus {
  Unauthorized = 401,
  NotFound = 404,
}

/** NestJS error bodies carry `message` as a string, or a list of validation messages. */
export function toApiErrorMessage(error: unknown): string {
  if (typeof error !== 'object' || error === null || !('message' in error)) {
    return FALLBACK_API_ERROR_MESSAGE;
  }
  const { message } = error;
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) return message.filter((line) => typeof line === 'string').join('. ');
  return FALLBACK_API_ERROR_MESSAGE;
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

/** A failed API call, with the message to show and the HTTP status the API reported. */
export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }

  static from(body: unknown): ApiRequestError {
    return new ApiRequestError(toApiErrorMessage(body), statusCodeOf(body));
  }
}
