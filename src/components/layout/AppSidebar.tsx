import { NavLink, useLocation } from 'react-router';
import { BrandMark } from '@/components/brand/BrandMark';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { NAV_ITEMS, NavBadge } from '@/config/navigation';
import { ChannelErrorsBadge } from '@/features/channels';
import { PendingReviewBadge } from '@/features/review';
import type { ComponentType } from 'react';
import { ROUTES } from '@/config/routes';
import { WorkspaceSwitcher } from '@/features/workspaces';
import { isNavItemActive } from './nav-active';

const MAIN_NAV_LABEL = 'Main';

const NAV_BADGES: Record<NavBadge, ComponentType> = {
  [NavBadge.ChannelErrors]: ChannelErrorsBadge,
  [NavBadge.PendingReview]: PendingReviewBadge,
};

function NavItemBadge({ badge }: { badge?: NavBadge }) {
  if (!badge) return null;
  const Badge = NAV_BADGES[badge];
  return <Badge />;
}

function NavItems({ onNavigate }: { onNavigate: () => void }) {
  const { pathname } = useLocation();
  return (
    <SidebarMenu>
      {NAV_ITEMS.map((item) => (
        <SidebarMenuItem key={item.to}>
          <SidebarMenuButton
            asChild
            isActive={isNavItemActive(pathname, item)}
            tooltip={item.label}
          >
            <NavLink to={item.to} end={item.end} onClick={onNavigate}>
              <item.icon />
              <span>{item.label}</span>
            </NavLink>
          </SidebarMenuButton>
          <NavItemBadge badge={item.badge} />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function AppSidebar() {
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
                <BrandMark className="size-7 shrink-0 group-data-[collapsible=icon]:size-5" />
                <span className="font-heading text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden">
                  crossmart
                </span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label={MAIN_NAV_LABEL}>
          <SidebarGroup>
            <SidebarGroupContent>
              <NavItems onNavigate={closeOnMobile} />
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <WorkspaceSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}
