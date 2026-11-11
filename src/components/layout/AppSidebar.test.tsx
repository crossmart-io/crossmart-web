import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ROUTES } from '@/config/routes';
import { AppSidebar } from './AppSidebar';

vi.mock('@/features/workspaces', () => ({ WorkspaceSwitcher: () => null }));
vi.mock('@/features/channels', () => ({ ChannelErrorsBadge: () => null }));
vi.mock('@/features/review', () => ({ PendingReviewBadge: () => null }));

function renderSidebar(entry: string) {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[entry]}>
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

  it('shows the six main pages and nothing else', () => {
    renderSidebar(ROUTES.home);
    const nav = within(screen.getByRole('navigation', { name: 'Main' }));
    expect(nav.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Home',
      'Products',
      'Orders',
      'Stores',
      'Agent',
      'Settings',
    ]);
  });

  it('highlights the item of the section the page belongs to', () => {
    renderSidebar(ROUTES.agentReview);
    const agent = screen.getByRole('link', { name: 'Agent' });
    expect(agent).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('data-active', 'true');
  });
});
