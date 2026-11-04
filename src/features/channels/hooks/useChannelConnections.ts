import { useMutation } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { api, fetchClient } from '@/api/client';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  CHANNEL_AUTHORIZATIONS_ENDPOINT,
  CHANNEL_CONNECTIONS_ENDPOINT,
  CHANNEL_DISCONNECT_ENDPOINT,
  CHANNEL_FEEDBACK,
} from '../channels.constants';
import type {
  AuthorizationRequest,
  ChannelConnection,
  StartedAuthorization,
} from '../channels.types';

const CONNECTION_ENDPOINTS = [CHANNEL_CONNECTIONS_ENDPOINT] as const;

/** The workspace's connections; waits until there is a workspace. */
export function useChannelConnections(workspaceId: string | undefined) {
  return api.useQuery(
    'get',
    CHANNEL_CONNECTIONS_ENDPOINT,
    { params: { path: { workspaceId: workspaceId ?? '' } } },
    { enabled: Boolean(workspaceId) },
  );
}

/** Asks the API for the channel's authorize URL, then leaves the app for it. */
export function useStartChannelAuthorization(workspaceId: string) {
  return useMutation<StartedAuthorization, Error, AuthorizationRequest>({
    meta: { inlineError: true },
    mutationFn: async (body) => {
      const { data, error } = await fetchClient.POST(CHANNEL_AUTHORIZATIONS_ENDPOINT, {
        params: { path: { workspaceId } },
        body,
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: ({ authorizationUrl }) => window.location.assign(authorizationUrl),
  });
}

export function useDisconnectChannel(workspaceId: string) {
  const refresh = useInvalidateEndpoints(CONNECTION_ENDPOINTS);
  return useMutation<ChannelConnection, Error, string>({
    meta: { successMessage: CHANNEL_FEEDBACK.disconnected },
    mutationFn: async (connectionId) => {
      const { data, error } = await fetchClient.POST(CHANNEL_DISCONNECT_ENDPOINT, {
        params: { path: { workspaceId, connectionId } },
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: refresh,
  });
}
