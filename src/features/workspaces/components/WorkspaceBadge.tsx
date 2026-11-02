import { Store } from 'lucide-react';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useCurrentWorkspace } from '../hooks/useCurrentWorkspace';
import { WORKSPACE_ROLE_LABELS } from '../workspace-role';

/** The workspace the app acts on, and the user's role in it. */
export function WorkspaceBadge() {
  const { workspace } = useCurrentWorkspace();
  if (!workspace) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* Not a button: there is nothing to switch to until agencies get more workspaces. */}
        <SidebarMenuButton size="lg" asChild className="cursor-default hover:bg-transparent">
          <div>
            <span className="grid size-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <Store className="size-4" />
            </span>
            <span className="flex min-w-0 flex-col text-left leading-tight">
              <span className="truncate font-medium">{workspace.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {WORKSPACE_ROLE_LABELS[workspace.role]} · {workspace.currency}
              </span>
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
