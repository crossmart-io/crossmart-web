import { useRef } from 'react';
import { Outlet } from 'react-router';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MAIN_CONTENT_ID } from '@/config/app';
import { USER_MENU_LINKS } from '@/config/navigation';
import { AgentWorkerLauncher, AgentWorkerProvider } from '@/features/agent-worker';
import { AskLauncher } from '@/features/ask';
import { UserMenu } from '@/features/auth';
import { AccountNoticeBanners, NotificationBell } from '@/features/notifications';
import { useCurrentWorkspace, useDefaultTimeZone, useMe } from '@/features/workspaces';
import { AppSidebar } from './AppSidebar';
import { BreadcrumbsProvider } from './BreadcrumbsProvider';
import { HeaderBreadcrumbs } from './HeaderBreadcrumbs';
import { PageLayout, usePageLayout } from './page-layout';
import { useFocusOnNavigation } from './useFocusOnNavigation';
import { useShellSidebar } from './useShellSidebar';

/** The reading column, or the whole space under the header with the page's own scrolling. */
const MAIN_CLASSES: Record<PageLayout, string> = {
  [PageLayout.Column]: 'mx-auto w-full max-w-6xl px-4 py-6 outline-none sm:px-6 lg:py-8',
  [PageLayout.Full]:
    'flex h-[calc(100svh-var(--app-header-height))] w-full flex-col gap-3 overflow-hidden p-3 outline-none',
};

/** The user menu's links this person may open; platform pages only for those who run Crossmart. */
function useUserMenuLinks() {
  const isPlatformAdmin = useMe().data?.platformAdmin ?? false;
  return USER_MENU_LINKS.filter((link) => !link.platformAdminOnly || isPlatformAdmin);
}

export function AppShell() {
  const mainRef = useRef<HTMLElement>(null);
  const layout = usePageLayout();
  const sidebar = useShellSidebar(layout);
  const userMenuLinks = useUserMenuLinks();
  useFocusOnNavigation(mainRef);
  useDefaultTimeZone(useCurrentWorkspace().workspace);

  return (
    <TooltipProvider>
      <BreadcrumbsProvider>
        <AgentWorkerProvider>
          <SidebarProvider open={sidebar.open} onOpenChange={sidebar.onOpenChange}>
            <a
              href={`#${MAIN_CONTENT_ID}`}
              className="sr-only z-50 rounded-md bg-background px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:ring-2 focus:ring-ring"
            >
              Skip to content
            </a>
            <AppSidebar />
            <SidebarInset>
              <header className="sticky top-0 z-20 flex h-(--app-header-height) items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <HeaderBreadcrumbs />
                <div className="ml-auto flex items-center gap-1">
                  <AgentWorkerLauncher />
                  <AskLauncher />
                  <NotificationBell />
                  <UserMenu links={userMenuLinks} />
                </div>
              </header>
              <main
                ref={mainRef}
                id={MAIN_CONTENT_ID}
                tabIndex={-1}
                className={MAIN_CLASSES[layout]}
              >
                <AccountNoticeBanners />
                <Outlet />
              </main>
            </SidebarInset>
          </SidebarProvider>
        </AgentWorkerProvider>
      </BreadcrumbsProvider>
    </TooltipProvider>
  );
}
