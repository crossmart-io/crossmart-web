import { ApiRequestError } from './api-error';

/** What every `fetchClient` call resolves to: the success body, or the error body. */
interface ApiResult {
  data?: unknown;
  error?: unknown;
  response: Response;
}

/** The body of a result's success branch (`{ data; error?: never }`). */
type SuccessData<Result> = Result extends { data: infer Data; error?: never } ? Data : never;

/**
 * Resolves to a request's success body, or throws its error as an `ApiRequestError`:
 * `return unwrap(fetchClient.GET('/api/v1/...', { params }))`. Checks the HTTP status too,
 * because the client reports an error without a body as `error: undefined`.
 */
export async function unwrap<Result extends ApiResult>(
  request: Promise<Result>,
): Promise<SuccessData<Result>> {
  const { data, error, response } = await request;
  if (error !== undefined || !response.ok) {
    throw ApiRequestError.from(error ?? { statusCode: response.status });
  }
  // A successful response always carries the success branch's body.
  return data as SuccessData<Result>;
}
