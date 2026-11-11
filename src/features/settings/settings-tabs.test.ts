import { WorkspacePermission } from '@/api/schema';
import { workspaceFixture } from '@/features/suggestions/testing/suggestion.fixture';
import { visibleSettingsTabs } from './settings-tabs';
import { SettingsTab } from './settings.constants';

function tabsFor(permissions: WorkspacePermission[]) {
  return visibleSettingsTabs(workspaceFixture(permissions)).map(({ tab }) => tab);
}

describe('visibleSettingsTabs', () => {
  it('shows every tab to a role that holds every permission', () => {
    expect(
      tabsFor([WorkspacePermission.workspace_manage, WorkspacePermission.billing_view]),
    ).toEqual([SettingsTab.General, SettingsTab.Team, SettingsTab.Billing, SettingsTab.Developers]);
  });

  it('hides General and Billing from a role that cannot use them', () => {
    expect(tabsFor([WorkspacePermission.products_view])).toEqual([
      SettingsTab.Team,
      SettingsTab.Developers,
    ]);
  });

  it('shows General to a role that may only delete the workspace', () => {
    expect(tabsFor([WorkspacePermission.workspace_delete])).toContain(SettingsTab.General);
  });
});
