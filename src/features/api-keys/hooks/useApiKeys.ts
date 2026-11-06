import { useMutation } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { api, fetchClient } from '@/api/client';
import type { components } from '@/api/schema';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import { API_KEY_ENDPOINT, API_KEY_FEEDBACK, API_KEYS_ENDPOINT } from '../api-keys.constants';

export type ApiKey = components['schemas']['ApiKeyDto'];
export type IssuedApiKey = components['schemas']['IssuedApiKeyDto'];
type NewApiKey = components['schemas']['CreateApiKeyDto'];

export function useApiKeys(workspaceId: string) {
  return api.useQuery('get', API_KEYS_ENDPOINT, { params: { path: { workspaceId } } });
}

const API_KEY_LIST_ENDPOINTS = [API_KEYS_ENDPOINT];

export function useCreateApiKey(workspaceId: string) {
  const refresh = useInvalidateEndpoints(API_KEY_LIST_ENDPOINTS);
  return useMutation<IssuedApiKey, Error, NewApiKey>({
    meta: { inlineError: true },
    mutationFn: (body) =>
      unwrap(
        fetchClient.POST(API_KEYS_ENDPOINT, {
          params: { path: { workspaceId } },
          body,
        }),
      ),
    onSuccess: refresh,
  });
}

export function useRevokeApiKey(workspaceId: string) {
  const refresh = useInvalidateEndpoints(API_KEY_LIST_ENDPOINTS);
  return useMutation<void, Error, string>({
    meta: { successMessage: API_KEY_FEEDBACK.revoked },
    mutationFn: async (apiKeyId) => {
      await unwrap(
        fetchClient.DELETE(API_KEY_ENDPOINT, {
          params: { path: { workspaceId, apiKeyId } },
        }),
      );
    },
    onSuccess: refresh,
  });
}
