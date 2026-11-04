import { Check, ChevronsUpDown, Plus, Store } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { WorkspaceRole } from '@/api/schema';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { roleLabel } from '../role-options';
import { selectWorkspace } from '../selected-workspace';
import { CreateWorkspaceDialog } from './CreateWorkspaceDialog';

function WorkspaceLabel({ workspace }: { workspace: Workspace }) {
  return (
    <>
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <Store className="size-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col text-left leading-tight">
        <span className="truncate font-medium">{workspace.displayName}</span>
        <span className="truncate text-xs text-muted-foreground">
          {roleLabel(workspace)} · {workspace.currency}
        </span>
      </span>
    </>
  );
}

/** The workspace the app acts on, and a menu to switch to another or create one. */
export function WorkspaceSwitcher() {
  const { workspace, workspaces } = useCurrentWorkspace();
  const [creating, setCreating] = useState(false);
  if (!workspace) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SwitcherMenu
          current={workspace}
          workspaces={workspaces}
          onCreate={workspace.role === WorkspaceRole.OWNER ? () => setCreating(true) : undefined}
        />
        <CreateWorkspaceDialog
          organizationId={workspace.organizationId}
          open={creating}
          onOpenChange={setCreating}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

interface SwitcherMenuProps {
  current: Workspace;
  workspaces: Workspace[];
  /** Only owners create workspaces in the organization. */
  onCreate?: () => void;
}

function SwitcherMenu({ current, workspaces, onCreate }: SwitcherMenuProps) {
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
              <span className="text-xs text-muted-foreground">{roleLabel(workspace)}</span>
            </span>
            {workspace.id === current.id && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
        {onCreate && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onCreate}>
              <Plus className="size-4" />
              Create workspace
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
