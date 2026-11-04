import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { api, fetchClient } from '@/api/client';
import { endpointQueryKey } from '@/api/query-keys';
import type { components } from '@/api/schema';
import { API_KEY_ENDPOINT, API_KEY_FEEDBACK, API_KEYS_ENDPOINT } from '../api-keys.constants';

export type ApiKey = components['schemas']['ApiKeyDto'];
export type IssuedApiKey = components['schemas']['IssuedApiKeyDto'];
type NewApiKey = components['schemas']['CreateApiKeyDto'];

export function useApiKeys(workspaceId: string) {
  return api.useQuery('get', API_KEYS_ENDPOINT, { params: { path: { workspaceId } } });
}

function useRefreshApiKeys() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: endpointQueryKey(API_KEYS_ENDPOINT) });
}

export function useCreateApiKey(workspaceId: string) {
  const refresh = useRefreshApiKeys();
  return useMutation<IssuedApiKey, Error, NewApiKey>({
    meta: { inlineError: true },
    mutationFn: async (body) => {
      const { data, error } = await fetchClient.POST(API_KEYS_ENDPOINT, {
        params: { path: { workspaceId } },
        body,
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: refresh,
  });
}

export function useRevokeApiKey(workspaceId: string) {
  const refresh = useRefreshApiKeys();
  return useMutation<void, Error, string>({
    meta: { successMessage: API_KEY_FEEDBACK.revoked },
    mutationFn: async (apiKeyId) => {
      const { error } = await fetchClient.DELETE(API_KEY_ENDPOINT, {
        params: { path: { workspaceId, apiKeyId } },
      });
      if (error) throw ApiRequestError.from(error);
    },
    onSuccess: refresh,
  });
}
