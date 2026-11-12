import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { unwrap } from '@/api/unwrap';
import { api, fetchClient } from '@/api/client';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  CHANNEL_AUTHORIZATIONS_ENDPOINT,
  CHANNEL_CONNECTIONS_ENDPOINT,
  CHANNEL_CREDENTIALS_ENDPOINT,
  CHANNEL_DISCONNECT_ENDPOINT,
  CHANNEL_FEEDBACK,
} from '../channels.constants';
import type {
  AuthorizationRequest,
  ChannelConnection,
  ConnectedChannel,
  ConnectWithCredentialsBody,
  StartedAuthorization,
} from '../channels.types';
import { connectedStoresUrl } from '../connect-redirect';

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
    mutationFn: (body) =>
      unwrap(
        fetchClient.POST(CHANNEL_AUTHORIZATIONS_ENDPOINT, {
          params: { path: { workspaceId } },
          body,
        }),
      ),
    onSuccess: ({ authorizationUrl }) => window.location.assign(authorizationUrl),
  });
}

/** Connects a store with the API details the merchant pasted, then announces it on Stores. */
export function useConnectWithCredentials(workspaceId: string) {
  const navigate = useNavigate();
  const refresh = useInvalidateEndpoints(CONNECTION_ENDPOINTS);
  return useMutation<ConnectedChannel, Error, ConnectWithCredentialsBody>({
    meta: { inlineError: true },
    mutationFn: (body) =>
      unwrap(
        fetchClient.POST(CHANNEL_CREDENTIALS_ENDPOINT, {
          params: { path: { workspaceId } },
          body,
        }),
      ),
    onSuccess: async (connected) => {
      await refresh();
      await navigate(connectedStoresUrl(connected));
    },
  });
}

export function useDisconnectChannel(workspaceId: string) {
  const refresh = useInvalidateEndpoints(CONNECTION_ENDPOINTS);
  return useMutation<ChannelConnection, Error, string>({
    meta: { successMessage: CHANNEL_FEEDBACK.disconnected },
    mutationFn: (connectionId) =>
      unwrap(
        fetchClient.POST(CHANNEL_DISCONNECT_ENDPOINT, {
          params: { path: { workspaceId, connectionId } },
        }),
      ),
    onSuccess: refresh,
  });
}
