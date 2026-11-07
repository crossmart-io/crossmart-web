import { useRef } from 'react';
import { Outlet } from 'react-router';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MAIN_CONTENT_ID } from '@/config/app';
import { AgentWorkerLauncher, AgentWorkerProvider } from '@/features/agent-worker';
import { AskLauncher } from '@/features/ask';
import { UserMenu, VerifyEmailBanner } from '@/features/auth';
import { BillingBanner } from '@/features/billing';
import { SandboxBanner } from '@/features/sandbox';
import { useCurrentWorkspace, useDefaultTimeZone } from '@/features/workspaces';
import { AppSidebar } from './AppSidebar';
import { BreadcrumbsProvider } from './BreadcrumbsProvider';
import { HeaderBreadcrumbs } from './HeaderBreadcrumbs';
import { useFocusOnNavigation } from './useFocusOnNavigation';

export function AppShell() {
  const mainRef = useRef<HTMLElement>(null);
  useFocusOnNavigation(mainRef);
  useDefaultTimeZone(useCurrentWorkspace().workspace);

  return (
    <TooltipProvider>
      <BreadcrumbsProvider>
        <AgentWorkerProvider>
          <SidebarProvider>
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
                  <UserMenu />
                </div>
              </header>
              <main
                ref={mainRef}
                id={MAIN_CONTENT_ID}
                tabIndex={-1}
                className="mx-auto w-full max-w-6xl px-4 py-6 outline-none sm:px-6 lg:py-8"
              >
                <SandboxBanner />
                <BillingBanner />
                <VerifyEmailBanner />
                <Outlet />
              </main>
            </SidebarInset>
          </SidebarProvider>
        </AgentWorkerProvider>
      </BreadcrumbsProvider>
    </TooltipProvider>
  );
}
