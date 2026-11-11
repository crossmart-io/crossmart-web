import { WorkspacePermission } from '@/api/schema';
import { ROUTES } from '@/config/routes';

export enum SettingsTab {
  General = 'general',
  Team = 'team',
  Billing = 'billing',
  Developers = 'developers',
}

export interface SettingsTabInfo {
  tab: SettingsTab;
  label: string;
  to: string;
  /** Shown only to roles that hold at least one of these; every role sees a tab without any. */
  anyOf?: readonly WorkspacePermission[];
}

/** Settings' tabs, in order. A role sees only the tabs it can use. */
export const SETTINGS_TABS: readonly SettingsTabInfo[] = [
  {
    tab: SettingsTab.General,
    label: 'General',
    to: ROUTES.generalSettings,
    anyOf: [WorkspacePermission.workspace_manage, WorkspacePermission.workspace_delete],
  },
  { tab: SettingsTab.Team, label: 'Team', to: ROUTES.team },
  {
    tab: SettingsTab.Billing,
    label: 'Billing',
    to: ROUTES.billing,
    anyOf: [WorkspacePermission.billing_view],
  },
  { tab: SettingsTab.Developers, label: 'Developers', to: ROUTES.developers },
];

export const SETTINGS_COPY = {
  pageName: 'Settings',
  tabsLabel: 'Settings sections',
  saved: 'Settings saved',
  save: 'Save',
  workspaceTitle: 'Workspace',
  nameLabel: 'Name',
  currencyNote: (currency: string) => `Catalog currency: ${currency}. It cannot change.`,
  timeZoneLabel: 'Time zone',
  timeZoneNote: 'Reports count days in this zone.',
  members: 'Members',
  manageRoles: 'Manage roles',
  roles: 'Roles',
  backToMembers: 'Members',
  apiKeys: 'API keys',
  webhooks: 'Webhooks',
  connectedAgents: 'Connected agents',
} as const;
