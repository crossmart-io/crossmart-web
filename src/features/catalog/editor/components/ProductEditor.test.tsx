import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { WorkspaceRole, OutsideAgentChanges } from '@/api/schema';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { useChannelConnections } from '@/features/channels/hooks/useChannelConnections';
import type { Workspace } from '@/features/workspaces';
import type * as MediaQueryHooks from '@/hooks/useMediaQuery';
import { EDITOR_FEEDBACK } from '../../catalog.constants';
import { ProductEditor } from './ProductEditor';

vi.mock('@/features/channels/hooks/useChannelConnections', () => ({
  useChannelConnections: vi.fn<typeof useChannelConnections>(
    () =>
      ({
        data: [],
      }) as unknown as ReturnType<typeof useChannelConnections>,
  ),
}));

// jsdom has no media queries; lay the editor out as on a desktop.
vi.mock('@/hooks/useMediaQuery', async (importOriginal) => ({
  ...(await importOriginal<typeof MediaQueryHooks>()),
  useMediaQuery: () => true,
}));

const WORKSPACE: Workspace = {
  id: 'ws-1',
  organizationId: 'org-1',
  name: 'Default',
  displayName: 'Demo Seller',
  slug: 'default',
  currency: 'USD',
  timeZone: null,
  sandbox: null,
  outsideAgentChanges: OutsideAgentChanges.require_approval,
  role: WorkspaceRole.VIEWER,
  customRole: null,
  permissions: [],
};

function renderEditor(readOnly: boolean) {
  // The unsaved-changes guard needs a data router.
  const router = createMemoryRouter([
    {
      path: '/',
      element: (
        <TooltipProvider>
          <ProductEditor workspace={WORKSPACE} readOnly={readOnly} />
        </TooltipProvider>
      ),
    },
  ]);
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('ProductEditor', () => {
  it('lets members who may edit change the fields', () => {
    renderEditor(false);

    expect(screen.getByLabelText('Title')).toBeEnabled();
    expect(screen.queryByText(EDITOR_FEEDBACK.readOnly)).not.toBeInTheDocument();
  });

  it('shows a read-only form, with the reason and no save bar, to other roles', () => {
    renderEditor(true);

    expect(screen.getByText(EDITOR_FEEDBACK.readOnly)).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeDisabled();
    expect(screen.getByRole('button', { name: /Add images/ })).toBeDisabled();
    expect(screen.queryByText(EDITOR_FEEDBACK.newProduct)).not.toBeInTheDocument();
  });
});
