import { Check, ChevronsUpDown, Store } from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/config/routes';
import { type Workspace, useCurrentWorkspace } from '../hooks/useCurrentWorkspace';
import { selectWorkspace } from '../selected-workspace';
import { WORKSPACE_ROLE_LABELS } from '../workspace-role';

function WorkspaceLabel({ workspace }: { workspace: Workspace }) {
  return (
    <>
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <Store className="size-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col text-left leading-tight">
        <span className="truncate font-medium">{workspace.displayName}</span>
        <span className="truncate text-xs text-muted-foreground">
          {WORKSPACE_ROLE_LABELS[workspace.role]} · {workspace.currency}
        </span>
      </span>
    </>
  );
}

/** The workspace the app acts on and the user's role in it; a menu to switch when there are more. */
export function WorkspaceSwitcher() {
  const { workspace, workspaces } = useCurrentWorkspace();
  if (!workspace) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {workspaces.length > 1 ? (
          <SwitcherMenu current={workspace} workspaces={workspaces} />
        ) : (
          <SidebarMenuButton size="lg" asChild className="cursor-default hover:bg-transparent">
            <div>
              <WorkspaceLabel workspace={workspace} />
            </div>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function SwitcherMenu({ current, workspaces }: { current: Workspace; workspaces: Workspace[] }) {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  function open(workspaceId: string) {
    if (workspaceId === current.id) return;
    selectWorkspace(workspaceId);
    void navigate(ROUTES.home);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" aria-label="Switch workspace">
          <WorkspaceLabel workspace={current} />
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" side={isMobile ? 'bottom' : 'right'} align="end">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
        {workspaces.map((workspace) => (
          <DropdownMenuItem key={workspace.id} onSelect={() => open(workspace.id)}>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate">{workspace.displayName}</span>
              <span className="text-xs text-muted-foreground">
                {WORKSPACE_ROLE_LABELS[workspace.role]}
              </span>
            </span>
            {workspace.id === current.id && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
