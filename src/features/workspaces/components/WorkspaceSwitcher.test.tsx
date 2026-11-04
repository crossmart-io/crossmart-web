import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { WorkspaceRole } from '@/api/schema';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useCurrentWorkspace, type Workspace } from '../hooks/useCurrentWorkspace';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

vi.mock('../hooks/useCurrentWorkspace', () => ({
  useCurrentWorkspace: vi.fn<typeof useCurrentWorkspace>(),
}));

function workspace(id: string, role: WorkspaceRole): Workspace {
  return {
    id,
    organizationId: 'org',
    name: id,
    displayName: id,
    slug: id,
    currency: 'USD',
    timeZone: null,
    role,
    customRole: null,
    permissions: [],
  };
}

async function openMenu(role: WorkspaceRole) {
  const current = workspace('Main', role);
  vi.mocked(useCurrentWorkspace).mockReturnValue({
    workspace: current,
    workspaces: [current, workspace('Client A', WorkspaceRole.EDITOR)],
    isPending: false,
    isError: false,
    error: null,
    refetch: vi.fn<() => void>(),
  });
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <SidebarProvider>
          <WorkspaceSwitcher />
        </SidebarProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Switch workspace' }));
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

describe('WorkspaceSwitcher', () => {
  beforeEach(stubMatchMedia);
  afterEach(() => vi.unstubAllGlobals());

  it('lists every workspace and lets an owner create one', async () => {
    await openMenu(WorkspaceRole.OWNER);
    expect(screen.getByRole('menuitem', { name: /Client A/ })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Create workspace' })).toBeInTheDocument();
  });

  it('offers no creation to other roles', async () => {
    await openMenu(WorkspaceRole.EDITOR);
    expect(screen.queryByRole('menuitem', { name: 'Create workspace' })).not.toBeInTheDocument();
  });
});
