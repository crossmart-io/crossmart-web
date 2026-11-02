import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toApiErrorMessage } from '@/api/api-error';
import { api, fetchClient } from '@/api/client';
import type { components } from '@/api/schema';
import { API_KEY_ENDPOINT, API_KEYS_ENDPOINT } from '../api-keys.constants';

const HTTP_METHOD_GET = 'get';

export type ApiKey = components['schemas']['ApiKeyDto'];
export type IssuedApiKey = components['schemas']['IssuedApiKeyDto'];
type NewApiKey = components['schemas']['CreateApiKeyDto'];

export function useApiKeys(workspaceId: string) {
  return api.useQuery('get', API_KEYS_ENDPOINT, { params: { path: { workspaceId } } });
}

function useRefreshApiKeys() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: [HTTP_METHOD_GET, API_KEYS_ENDPOINT] });
}

export function useCreateApiKey(workspaceId: string) {
  const refresh = useRefreshApiKeys();
  return useMutation<IssuedApiKey, Error, NewApiKey>({
    mutationFn: async (body) => {
      const { data, error } = await fetchClient.POST(API_KEYS_ENDPOINT, {
        params: { path: { workspaceId } },
        body,
      });
      if (error) throw new Error(toApiErrorMessage(error));
      return data;
    },
    onSuccess: refresh,
  });
}

export function useRevokeApiKey(workspaceId: string) {
  const refresh = useRefreshApiKeys();
  return useMutation<void, Error, string>({
    mutationFn: async (apiKeyId) => {
      const { error } = await fetchClient.DELETE(API_KEY_ENDPOINT, {
        params: { path: { workspaceId, apiKeyId } },
      });
      if (error) throw new Error(toApiErrorMessage(error));
    },
    onSuccess: refresh,
  });
}
