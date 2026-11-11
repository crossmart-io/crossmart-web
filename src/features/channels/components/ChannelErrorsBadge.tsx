import { SidebarMenuBadge } from '@/components/ui/sidebar';
import { useAttentionCounts } from '@/features/attention';
import { useCurrentWorkspace } from '@/features/workspaces';

/**
 * The Stores menu item's count: stores to reconnect and listings the stores refused, from the
 * attention summary that Home lists them from.
 */
export function ChannelErrorsBadge() {
  const { workspace } = useCurrentWorkspace();
  const { stores, listings } = useAttentionCounts(workspace?.id);
  const count = stores + listings;
  if (count === 0) return null;
  return (
    <SidebarMenuBadge className="bg-destructive/15 text-destructive peer-hover/menu-button:text-destructive peer-data-active/menu-button:text-destructive">
      {count}
      <span className="sr-only"> {count === 1 ? 'store problem' : 'store problems'}</span>
    </SidebarMenuBadge>
  );
}
