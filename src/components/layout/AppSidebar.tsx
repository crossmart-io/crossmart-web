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
import type { ComponentType } from 'react';
import { ROUTES } from '@/config/routes';
import { WorkspaceSwitcher } from '@/features/workspaces';

const NAV_BADGES: Record<NavBadge, ComponentType> = {
  [NavBadge.ChannelErrors]: ChannelErrorsBadge,
};

function NavItemBadge({ badge }: { badge?: NavBadge }) {
  if (!badge) return null;
  const Badge = NAV_BADGES[badge];
  return <Badge />;
}

function isActive(pathname: string, item: NavItem): boolean {
  return item.end ? pathname === item.to : pathname.startsWith(item.to);
}

export function AppSidebar() {
  const { pathname } = useLocation();
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
        {NAV_GROUPS.map((group) => (
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
      </SidebarContent>
      <SidebarFooter>
        <WorkspaceSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}
