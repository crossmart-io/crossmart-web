export const ME_ENDPOINT = '/api/v1/me';
export const WORKSPACE_ENDPOINT = '/api/v1/workspaces/{workspaceId}';
export const ORGANIZATION_WORKSPACES_ENDPOINT = '/api/v1/organizations/{organizationId}/workspaces';
export const MEMBERS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/members';
export const MEMBER_ENDPOINT = '/api/v1/workspaces/{workspaceId}/members/{userId}';
export const MEMBERSHIP_ENDPOINT = '/api/v1/workspaces/{workspaceId}/membership';
export const INVITATIONS_ENDPOINT = '/api/v1/workspaces/{workspaceId}/invitations';
export const INVITATION_ENDPOINT = '/api/v1/workspaces/{workspaceId}/invitations/{invitationId}';
export const ROLES_ENDPOINT = '/api/v1/workspaces/{workspaceId}/roles';
export const ROLE_ENDPOINT = '/api/v1/workspaces/{workspaceId}/roles/{roleId}';
export const INVITATION_PREVIEW_ENDPOINT = '/api/v1/invitations/preview';
export const INVITATION_ACCEPT_ENDPOINT = '/api/v1/invitations/accept';

/** Remembers the workspace the user last opened, per browser. */
export const SELECTED_WORKSPACE_STORAGE_KEY = 'crossmart:workspace';

/** The query parameter of the emailed invitation link. */
export const INVITATION_TOKEN_QUERY = 'token';

export const DELETION_FEEDBACK = {
  workspaceDeleted: 'Workspace deleted.',
} as const;

/** Toasts after workspace changes. */
export const WORKSPACE_FEEDBACK = {
  created: 'Workspace created. You are in it now.',
  renamed: 'Workspace renamed',
} as const;

/** Currencies offered for a new workspace's catalog; the API takes any ISO 4217 code. */
export const CURRENCY_CHOICES = ['USD', 'EUR', 'GBP', 'ILS', 'CAD', 'AUD', 'JPY'] as const;
export const DEFAULT_CURRENCY = 'USD';
export const WORKSPACE_NAME_MAX_LENGTH = 200;

/** Toasts after membership changes. */
export const MEMBERS_FEEDBACK = {
  invited: 'Invitation sent',
  invitationRevoked: 'Invitation revoked',
  roleChanged: 'Role changed',
  removed: 'Member removed',
  left: 'You left the workspace',
  switched: 'Switched workspace',
} as const;
