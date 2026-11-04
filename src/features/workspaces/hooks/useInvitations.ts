import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiRequestError } from '@/api/api-error';
import { api, fetchClient } from '@/api/client';
import { endpointQueryKey } from '@/api/query-keys';
import type { components } from '@/api/schema';
import { selectWorkspace } from '../selected-workspace';
import {
  INVITATION_ACCEPT_ENDPOINT,
  INVITATION_ENDPOINT,
  INVITATION_PREVIEW_ENDPOINT,
  INVITATIONS_ENDPOINT,
  ME_ENDPOINT,
  MEMBERS_FEEDBACK,
} from '../workspaces.constants';

export type Invitation = components['schemas']['InvitationDto'];
export type InvitationPreview = components['schemas']['InvitationPreviewDto'];
type NewInvitation = components['schemas']['InviteMemberDto'];

export function useInvitations(workspaceId: string) {
  return api.useQuery('get', INVITATIONS_ENDPOINT, { params: { path: { workspaceId } } });
}

function useRefreshInvitations() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: endpointQueryKey(INVITATIONS_ENDPOINT) });
}

export function useInviteMember(workspaceId: string) {
  const refresh = useRefreshInvitations();
  return useMutation<Invitation, Error, NewInvitation>({
    meta: { inlineError: true, successMessage: MEMBERS_FEEDBACK.invited },
    mutationFn: async (body) => {
      const { data, error } = await fetchClient.POST(INVITATIONS_ENDPOINT, {
        params: { path: { workspaceId } },
        body,
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
    onSuccess: refresh,
  });
}

export function useRevokeInvitation(workspaceId: string) {
  const refresh = useRefreshInvitations();
  return useMutation<void, Error, string>({
    meta: { successMessage: MEMBERS_FEEDBACK.invitationRevoked },
    mutationFn: async (invitationId) => {
      const { error } = await fetchClient.DELETE(INVITATION_ENDPOINT, {
        params: { path: { workspaceId, invitationId } },
      });
      if (error) throw ApiRequestError.from(error);
    },
    onSuccess: refresh,
  });
}

/** What the link is for. A POST, so the token stays out of URLs the API logs. */
export function useInvitationPreview(token: string) {
  return useQuery<InvitationPreview, Error>({
    queryKey: [INVITATION_PREVIEW_ENDPOINT, token],
    enabled: token.length > 0,
    retry: false,
    queryFn: async () => {
      const { data, error } = await fetchClient.POST(INVITATION_PREVIEW_ENDPOINT, {
        body: { token },
      });
      if (error) throw ApiRequestError.from(error);
      return data;
    },
  });
}

/** Joins the workspace and makes it the one the app opens. */
export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    meta: { inlineError: true },
    mutationFn: async (token) => {
      const { data, error } = await fetchClient.POST(INVITATION_ACCEPT_ENDPOINT, {
        body: { token },
      });
      if (error) throw ApiRequestError.from(error);
      selectWorkspace(data.workspaceId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: endpointQueryKey(ME_ENDPOINT) }),
  });
}
