/**
 * The first element of every key the generated query hooks build (`['get', path, init]`).
 * Hand-written queries start their keys the same way, so one invalidation refreshes both.
 */
export const HTTP_METHOD_GET = 'get';

/** The key prefix of every GET query on `endpoint`, whatever its parameters. */
export function endpointQueryKey(endpoint: string): readonly [string, string] {
  return [HTTP_METHOD_GET, endpoint];
}
