import { env } from '@/config/env';

/** Values for the `{name}` placeholders of an OpenAPI path. */
type PathParams = Record<string, string>;

/**
 * `/api/v1/workspaces/{workspaceId}/…` with each placeholder filled in, on the API's origin, for
 * the requests the typed client cannot make: event streams read as they arrive.
 */
export function toApiUrl(path: string, params: PathParams): string {
  const filled = Object.entries(params).reduce(
    (url, [name, value]) => url.replace(`{${name}}`, encodeURIComponent(value)),
    path,
  );
  return `${env.apiUrl}${filled}`;
}
