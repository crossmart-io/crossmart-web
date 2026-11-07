export const SANDBOX_CLAIM_PREVIEW_ENDPOINT = '/api/v1/sandbox-claims/preview';
export const SANDBOX_CLAIM_ENDPOINT = '/api/v1/sandbox-claims';
export const WORKSPACE_SANDBOX_CLAIM_ENDPOINT = '/api/v1/workspaces/{workspaceId}/sandbox/claim';

/** The query parameter of the emailed claim link (`/claim?token=…`). */
export const SANDBOX_CLAIM_TOKEN_QUERY = 'token';

/** Toasts after claiming. */
export const SANDBOX_FEEDBACK = {
  claimed: 'The account is yours now. Connect a store to start selling.',
} as const;
