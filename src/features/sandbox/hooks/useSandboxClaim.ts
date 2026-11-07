import { useMutation, useQuery } from '@tanstack/react-query';
import { authClient } from '@/api/auth-client';
import { fetchClient } from '@/api/client';
import type { components } from '@/api/schema';
import { unwrap } from '@/api/unwrap';
import { AuthRequestError, refreshSession } from '@/features/auth';
import { ME_ENDPOINT, selectWorkspace } from '@/features/workspaces';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  SANDBOX_CLAIM_ENDPOINT,
  SANDBOX_CLAIM_PREVIEW_ENDPOINT,
  SANDBOX_FEEDBACK,
  WORKSPACE_SANDBOX_CLAIM_ENDPOINT,
} from '../sandbox.constants';

export type SandboxClaimPreview = components['schemas']['SandboxClaimPreviewDto'];

const ME_ENDPOINTS = [ME_ENDPOINT];

interface PasswordClaim {
  token: string;
  password: string;
}

/** What the claim link is for. A POST, so the token stays out of URLs the API logs. */
export function useSandboxClaimPreview(token: string) {
  return useQuery<SandboxClaimPreview, Error>({
    queryKey: [SANDBOX_CLAIM_PREVIEW_ENDPOINT, token],
    enabled: token.length > 0,
    retry: false,
    queryFn: () => unwrap(fetchClient.POST(SANDBOX_CLAIM_PREVIEW_ENDPOINT, { body: { token } })),
  });
}

/** Claims with the password the person chose, then signs them in and opens the workspace. */
export function useClaimWithPassword() {
  return useMutation<void, Error, PasswordClaim>({
    meta: { inlineError: true, successMessage: SANDBOX_FEEDBACK.claimed },
    mutationFn: async (claim) => {
      const claimed = await unwrap(fetchClient.POST(SANDBOX_CLAIM_ENDPOINT, { body: claim }));
      const { error } = await authClient.signIn.email({
        email: claimed.email,
        password: claim.password,
      });
      if (error) throw AuthRequestError.from(error);
      selectWorkspace(claimed.workspaceId);
      refreshSession();
    },
  });
}

/** Claims a sandbox the signed-in owner is in, from the app or from the link. */
export function useClaimAsOwner() {
  const refreshMe = useInvalidateEndpoints(ME_ENDPOINTS);
  return useMutation<void, Error, string>({
    meta: { inlineError: true, successMessage: SANDBOX_FEEDBACK.claimed },
    mutationFn: async (workspaceId) => {
      await unwrap(
        fetchClient.POST(WORKSPACE_SANDBOX_CLAIM_ENDPOINT, { params: { path: { workspaceId } } }),
      );
      selectWorkspace(workspaceId);
    },
    onSuccess: refreshMe,
  });
}
