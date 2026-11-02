import { WorkspaceRole } from '@/api/schema';

export const API_KEYS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/api-keys';
export const API_KEY_ENDPOINT = '/api/v1/workspaces/{workspaceId}/api-keys/{apiKeyId}';

/** Keys can never be owners. The API also refuses roles above the creator's own. */
export const ASSIGNABLE_KEY_ROLES = [
  WorkspaceRole.EDITOR,
  WorkspaceRole.APPROVER,
  WorkspaceRole.VIEWER,
  WorkspaceRole.ADMIN,
] as const;

export const DEFAULT_KEY_ROLE = WorkspaceRole.EDITOR;

/** Toasts after key changes. */
export const API_KEY_FEEDBACK = {
  revoked: 'API key revoked',
  copied: 'Key copied to the clipboard',
  copyFailed: 'Could not copy. Select the key and copy it yourself.',
} as const;
