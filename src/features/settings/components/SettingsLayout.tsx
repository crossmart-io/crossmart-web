import { Navigate, Outlet, useLocation } from 'react-router';
import { Page } from '@/components/layout/Page';
import { RouteTabs } from '@/components/navigation/RouteTabs';
import { PAGE_PARENTS } from '@/config/navigation';
import { useCurrentWorkspace } from '@/features/workspaces';
import { isPathWithin } from '@/lib/path-match';
import { visibleSettingsTabs } from '../settings-tabs';
import { SETTINGS_COPY } from '../settings.constants';

/** Settings as one page: a tab per section the role can use, each with its own address. */
export function SettingsLayout() {
  const { pathname } = useLocation();
  const tabs = visibleSettingsTabs(useCurrentWorkspace().workspace);
  const active = tabs.find((tab) => isPathWithin(pathname, tab.to));

  return (
    <Page
      name={active?.label ?? SETTINGS_COPY.pageName}
      title={SETTINGS_COPY.pageName}
      parents={PAGE_PARENTS.settings}
    >
      <RouteTabs tabs={tabs} label={SETTINGS_COPY.tabsLabel} />
      <Outlet />
    </Page>
  );
}

/** `/settings` opens on the first tab this role can use. */
export function SettingsIndexRedirect() {
  const { workspace } = useCurrentWorkspace();
  const [first] = visibleSettingsTabs(workspace);
  if (!workspace || !first) return null;
  return <Navigate to={first.to} replace />;
}
