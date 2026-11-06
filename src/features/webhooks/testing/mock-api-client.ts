import createQueryClient from 'openapi-react-query';

/** A `fetchClient` call, as the tests stub it. */
type ApiCall = (path: string, init?: unknown) => Promise<unknown>;

/**
 * Stands in for `@/api/client`: every method is a mock, and the query bindings run on them, so
 * the hooks under test send their real requests to the stubs.
 * `vi.mock('@/api/client', async () => (await import('../testing/mock-api-client')).createMockApiClient())`
 */
export function createMockApiClient() {
  const fetchClient = {
    GET: vi.fn<ApiCall>(),
    POST: vi.fn<ApiCall>(),
    PATCH: vi.fn<ApiCall>(),
    DELETE: vi.fn<ApiCall>(),
  };
  return { fetchClient, api: createQueryClient(fetchClient as never) };
}

/** What `fetchClient` resolves to when the API answers with `data`. */
export function apiOk(data: unknown, status = 200) {
  return { data, response: new Response(null, { status }) };
}

/** What `fetchClient` resolves to when the API refuses with an error body. */
export function apiError(status: number, error: object) {
  return { error: { statusCode: status, ...error }, response: new Response(null, { status }) };
}
