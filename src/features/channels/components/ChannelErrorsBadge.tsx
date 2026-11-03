import { SidebarMenuBadge } from '@/components/ui/sidebar';
import { useCurrentWorkspace } from '@/features/workspaces';
import { totalFailedListings } from '../connection-status';
import { useChannelConnections } from '../hooks/useChannelConnections';

/** The Channels menu item's count of listings whose last sync failed, across every store. */
export function ChannelErrorsBadge() {
  const { workspace } = useCurrentWorkspace();
  const { data } = useChannelConnections(workspace?.id);
  const failed = totalFailedListings(data ?? []);
  if (failed === 0) return null;
  return (
    <SidebarMenuBadge className="bg-destructive/15 text-destructive peer-hover/menu-button:text-destructive peer-data-active/menu-button:text-destructive">
      {failed}
      <span className="sr-only"> {failed === 1 ? 'listing error' : 'listing errors'}</span>
    </SidebarMenuBadge>
  );
}
