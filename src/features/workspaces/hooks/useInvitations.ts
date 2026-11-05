import { useMutation, useQuery } from '@tanstack/react-query';
import { unwrap } from '@/api/unwrap';
import { api, fetchClient } from '@/api/client';
import type { components } from '@/api/schema';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
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

const INVITATION_LIST_ENDPOINTS = [INVITATIONS_ENDPOINT];
const ME_ENDPOINTS = [ME_ENDPOINT];

export function useInviteMember(workspaceId: string) {
  const refresh = useInvalidateEndpoints(INVITATION_LIST_ENDPOINTS);
  return useMutation<Invitation, Error, NewInvitation>({
    meta: { inlineError: true, successMessage: MEMBERS_FEEDBACK.invited },
    mutationFn: (body) =>
      unwrap(
        fetchClient.POST(INVITATIONS_ENDPOINT, {
          params: { path: { workspaceId } },
          body,
        }),
      ),
    onSuccess: refresh,
  });
}

export function useRevokeInvitation(workspaceId: string) {
  const refresh = useInvalidateEndpoints(INVITATION_LIST_ENDPOINTS);
  return useMutation<void, Error, string>({
    meta: { successMessage: MEMBERS_FEEDBACK.invitationRevoked },
    mutationFn: async (invitationId) => {
      await unwrap(
        fetchClient.DELETE(INVITATION_ENDPOINT, {
          params: { path: { workspaceId, invitationId } },
        }),
      );
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
    queryFn: () =>
      unwrap(
        fetchClient.POST(INVITATION_PREVIEW_ENDPOINT, {
          body: { token },
        }),
      ),
  });
}

/** Joins the workspace and makes it the one the app opens. */
export function useAcceptInvitation() {
  const refreshMe = useInvalidateEndpoints(ME_ENDPOINTS);
  return useMutation<void, Error, string>({
    meta: { inlineError: true },
    mutationFn: async (token) => {
      const data = await unwrap(
        fetchClient.POST(INVITATION_ACCEPT_ENDPOINT, {
          body: { token },
        }),
      );
      selectWorkspace(data.workspaceId);
    },
    onSuccess: refreshMe,
  });
}
