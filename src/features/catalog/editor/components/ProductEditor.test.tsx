import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { WorkspaceRole, OutsideAgentChanges } from '@/api/schema';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { useChannelConnections } from '@/features/channels/hooks/useChannelConnections';
import type { Workspace } from '@/features/workspaces';
import type * as MediaQueryHooks from '@/hooks/useMediaQuery';
import { CREATE_BAR_COPY, EDITOR_FEEDBACK, MORE_DETAILS_COPY } from '../../catalog.constants';
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

function renderEditor(readOnly: boolean, publishes = false) {
  // The unsaved-changes guard needs a data router.
  const router = createMemoryRouter([
    {
      path: '/',
      element: (
        <TooltipProvider>
          <ProductEditor workspace={WORKSPACE} readOnly={readOnly} publishes={publishes} />
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
    expect(screen.getByRole('button', { name: /Add photos/ })).toBeDisabled();
    expect(screen.queryByText(CREATE_BAR_COPY.newProduct)).not.toBeInTheDocument();
  });

  it('starts a new item as one, unconditioned, with the rest folded away', () => {
    renderEditor(false);

    expect(screen.getByLabelText('Quantity')).toHaveValue('1');
    expect(screen.getByRole('combobox', { name: 'Condition' })).toHaveTextContent('Not set');
    expect(screen.queryByLabelText('SKU')).not.toBeInTheDocument();
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });

  it('opens More details on request', async () => {
    renderEditor(false);

    await userEvent.click(
      screen.getByRole('button', { name: new RegExp(MORE_DETAILS_COPY.title) }),
    );
    expect(screen.getByLabelText('SKU')).toBeInTheDocument();
    expect(screen.getByLabelText('Type')).not.toHaveAttribute('placeholder');
  });

  it('offers to publish or keep a draft', () => {
    renderEditor(false, true);

    expect(screen.getByRole('button', { name: CREATE_BAR_COPY.publish })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: CREATE_BAR_COPY.draft })).toBeInTheDocument();
  });
});
