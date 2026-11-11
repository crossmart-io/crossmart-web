import { hasPermission, type Workspace } from '@/features/workspaces';
import { SETTINGS_TABS, type SettingsTabInfo } from './settings.constants';

/** The tabs this workspace's role can use; all of them while the workspace is unknown. */
export function visibleSettingsTabs(workspace: Workspace | undefined): SettingsTabInfo[] {
  if (!workspace) return [...SETTINGS_TABS];
  return SETTINGS_TABS.filter(
    (tab) => !tab.anyOf || tab.anyOf.some((permission) => hasPermission(workspace, permission)),
  );
}
