import { SidebarMenuBadge } from '@/components/ui/sidebar';
import { useCurrentWorkspace } from '@/features/workspaces';
import { usePendingSuggestionCount } from '../hooks/useSuggestions';

/** The Suggestions menu item's count of suggestions waiting for review. */
export function PendingSuggestionsBadge() {
  const { workspace } = useCurrentWorkspace();
  const pending = usePendingSuggestionCount(workspace?.id);
  if (pending === 0) return null;
  return (
    <SidebarMenuBadge>
      {pending}
      <span className="sr-only">
        {' '}
        {pending === 1 ? 'suggestion to review' : 'suggestions to review'}
      </span>
    </SidebarMenuBadge>
  );
}
