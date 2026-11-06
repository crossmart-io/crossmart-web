import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { WorkspacePermission, WorkspaceRole } from '@/api/schema';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ROUTES } from '@/config/routes';
import type * as Workspaces from '@/features/workspaces';
import { useCurrentWorkspace, type Workspace } from '@/features/workspaces';
import { AppSidebar } from './AppSidebar';

vi.mock('@/features/workspaces', async (importOriginal) => ({
  ...(await importOriginal<typeof Workspaces>()),
  useCurrentWorkspace: vi.fn<typeof useCurrentWorkspace>(),
  WorkspaceSwitcher: () => null,
}));
vi.mock('@/features/channels', () => ({ ChannelErrorsBadge: () => null }));
vi.mock('@/features/suggestions', () => ({ PendingSuggestionsBadge: () => null }));

function workspaceWith(permissions: WorkspacePermission[]): Workspace {
  return {
    id: 'ws-1',
    organizationId: 'org',
    name: 'Main',
    displayName: 'Main',
    slug: 'main',
    currency: 'USD',
    timeZone: null,
    role: WorkspaceRole.CUSTOM,
    customRole: null,
    permissions,
  };
}

function renderSidebar(workspace: Workspace | undefined) {
  vi.mocked(useCurrentWorkspace).mockReturnValue({
    workspace,
    workspaces: workspace ? [workspace] : [],
    isPending: false,
    isError: false,
    error: null,
    refetch: vi.fn<() => void>(),
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
          </SidebarProvider>
        </TooltipProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

/** The sidebar asks whether the screen is narrow; jsdom has no media queries. */
function stubMatchMedia() {
  vi.stubGlobal(
    'matchMedia',
    vi.fn<(query: string) => MediaQueryList>(
      (query) =>
        ({
          matches: false,
          media: query,
          addEventListener: vi.fn<() => void>(),
          removeEventListener: vi.fn<() => void>(),
        }) as unknown as MediaQueryList,
    ),
  );
}

describe('AppSidebar', () => {
  beforeEach(stubMatchMedia);
  afterEach(() => vi.unstubAllGlobals());

  it('links to webhooks for a role that manages them', () => {
    renderSidebar(workspaceWith([WorkspacePermission.webhooks_manage]));
    expect(screen.getByRole('link', { name: 'Webhooks' })).toHaveAttribute('href', ROUTES.webhooks);
  });

  it('hides webhooks from other roles', () => {
    renderSidebar(workspaceWith([WorkspacePermission.products_view]));
    expect(screen.queryByRole('link', { name: 'Webhooks' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'API keys' })).toBeInTheDocument();
  });

  it('hides webhooks while the workspace is unknown', () => {
    renderSidebar(undefined);
    expect(screen.queryByRole('link', { name: 'Webhooks' })).not.toBeInTheDocument();
  });
});
