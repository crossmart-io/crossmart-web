import { NavLink, useLocation } from 'react-router';
import { BrandMark } from '@/components/brand/BrandMark';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { NAV_GROUPS, NavBadge, type NavItem } from '@/config/navigation';
import { ChannelErrorsBadge } from '@/features/channels';
import { PendingSuggestionsBadge } from '@/features/suggestions';
import type { ComponentType } from 'react';
import { ROUTES } from '@/config/routes';
import {
  hasPermission,
  useCurrentWorkspace,
  useMe,
  type Workspace,
  WorkspaceSwitcher,
} from '@/features/workspaces';

const MAIN_NAV_LABEL = 'Main';

const NAV_BADGES: Record<NavBadge, ComponentType> = {
  [NavBadge.ChannelErrors]: ChannelErrorsBadge,
  [NavBadge.PendingSuggestions]: PendingSuggestionsBadge,
};

function NavItemBadge({ badge }: { badge?: NavBadge }) {
  if (!badge) return null;
  const Badge = NAV_BADGES[badge];
  return <Badge />;
}

function isActive(pathname: string, item: NavItem): boolean {
  return item.end ? pathname === item.to : pathname.startsWith(item.to);
}

/** Who is looking at the sidebar, as far as its gated items care. */
interface NavViewer {
  workspace: Workspace | undefined;
  isPlatformAdmin: boolean;
}

/**
 * Items gated by a permission stay hidden until the workspace says the role holds it, and
 * platform admin items until `/me` says the user is one.
 */
function isVisible(item: NavItem, { workspace, isPlatformAdmin }: NavViewer): boolean {
  if (item.platformAdminOnly && !isPlatformAdmin) return false;
  return !item.permission || (workspace !== undefined && hasPermission(workspace, item.permission));
}

/** The groups as this viewer sees them; a group with no visible item is left out. */
function visibleGroups(viewer: NavViewer) {
  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => isVisible(item, viewer)),
  })).filter((group) => group.items.length > 0);
}

export function AppSidebar() {
  const { pathname } = useLocation();
  const { workspace } = useCurrentWorkspace();
  const isPlatformAdmin = useMe().data?.platformAdmin ?? false;
  const { isMobile, setOpenMobile } = useSidebar();
  // On phones the sidebar is a sheet over the page; picking a page should reveal that page.
  const closeOnMobile = () => isMobile && setOpenMobile(false);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to={ROUTES.home} onClick={closeOnMobile}>
                <BrandMark className="size-7" />
                <span className="font-heading text-lg font-bold tracking-tight">crossmart</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label={MAIN_NAV_LABEL} className="flex flex-col gap-2">
          {visibleGroups({ workspace, isPlatformAdmin }).map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(pathname, item)}
                        tooltip={item.label}
                      >
                        <NavLink to={item.to} end={item.end} onClick={closeOnMobile}>
                          <item.icon />
                          <span>{item.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                      <NavItemBadge badge={item.badge} />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <WorkspaceSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}
