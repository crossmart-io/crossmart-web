const FALLBACK_API_ERROR_MESSAGE = 'Something went wrong. Please try again.';

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
