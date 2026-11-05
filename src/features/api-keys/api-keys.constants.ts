import { WorkspaceRole } from '@/api/schema';

export const API_KEYS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/api-keys';
export const API_KEY_ENDPOINT = '/api/v1/workspaces/{workspaceId}/api-keys/{apiKeyId}';

/** Keys can never be owners. The API also refuses roles beyond the creator's own. */
export const KEY_EXCLUDED_ROLES: readonly WorkspaceRole[] = [WorkspaceRole.OWNER];

export const DEFAULT_KEY_ROLE: string = WorkspaceRole.EDITOR;

/** Toasts after key changes. */
export const API_KEY_FEEDBACK = {
  revoked: 'API key revoked',
  copied: 'Key copied to the clipboard',
} as const;
