import { WorkspacePermission } from '@/api/schema';

interface PermissionChoice {
  permission: WorkspacePermission;
  label: string;
}

export interface PermissionGroup {
  label: string;
  permissions: readonly PermissionChoice[];
}

/** Opening the workspace; every role has it, so it is shown checked and fixed. */
export const ALWAYS_GRANTED_PERMISSION = WorkspacePermission.workspace_view;

/**
 * Every permission a custom role can hold, by area, as people read them. Deleting the workspace
 * is left out: only owners have it.
 */
export const PERMISSION_GROUPS: readonly PermissionGroup[] = [
  {
    label: 'Workspace',
    permissions: [
      { permission: WorkspacePermission.workspace_view, label: 'Open the workspace' },
      { permission: WorkspacePermission.workspace_manage, label: 'Change workspace settings' },
      { permission: WorkspacePermission.billing_view, label: 'See the plan and its usage' },
    ],
  },
  {
    label: 'Products',
    permissions: [
      { permission: WorkspacePermission.products_view, label: 'See products and imports' },
      {
        permission: WorkspacePermission.products_edit,
        label: 'Create, edit, import and delete products',
      },
    ],
  },
  {
    label: 'Inventory',
    permissions: [
      { permission: WorkspacePermission.inventory_view, label: 'See stock and its history' },
      { permission: WorkspacePermission.inventory_edit, label: 'Adjust and import stock' },
    ],
  },
  {
    label: 'Orders and reports',
    permissions: [
      { permission: WorkspacePermission.orders_view, label: 'See orders' },
      { permission: WorkspacePermission.reports_view, label: 'See sales and stock value' },
    ],
  },
  {
    label: 'Channels',
    permissions: [
      { permission: WorkspacePermission.channels_view, label: 'See stores and their listings' },
      {
        permission: WorkspacePermission.listings_edit,
        label: 'Add products to stores and override them',
      },
      {
        permission: WorkspacePermission.channels_manage,
        label: 'Connect stores, set their rules and sync',
      },
    ],
  },
  {
    label: 'Team',
    permissions: [
      { permission: WorkspacePermission.members_view, label: 'See members and roles' },
      {
        permission: WorkspacePermission.members_manage,
        label: 'Invite and remove members, change and edit roles',
      },
      { permission: WorkspacePermission.api_keys_manage, label: 'Create and revoke API keys' },
    ],
  },
  {
    label: 'Activity and AI',
    permissions: [
      { permission: WorkspacePermission.activity_view, label: 'See the activity log' },
      { permission: WorkspacePermission.suggestions_view, label: 'See AI suggestions' },
      {
        permission: WorkspacePermission.ai_generate,
        label: 'Ask AI to write content (uses AI credits)',
      },
      {
        permission: WorkspacePermission.suggestions_approve,
        label: 'Approve and reject AI suggestions',
      },
    ],
  },
];
