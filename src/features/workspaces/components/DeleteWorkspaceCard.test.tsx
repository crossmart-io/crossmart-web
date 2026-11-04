import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as DeletionHooks from '../hooks/useDeletion';
import { useDeleteWorkspace } from '../hooks/useDeletion';
import { DeleteWorkspaceCard } from './DeleteWorkspaceCard';

vi.mock('../hooks/useDeletion', async (importOriginal) => ({
  ...(await importOriginal<typeof DeletionHooks>()),
  useDeleteWorkspace: vi.fn<typeof useDeleteWorkspace>(),
}));

describe('DeleteWorkspaceCard', () => {
  it('deletes only once the workspace name is typed', async () => {
    const mutate = vi.fn<(name: string) => void>();
    vi.mocked(useDeleteWorkspace).mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof useDeleteWorkspace>);
    render(
      <QueryClientProvider client={new QueryClient()}>
        <DeleteWorkspaceCard workspaceId="ws-1" workspaceName="Default" />
      </QueryClientProvider>,
    );
    const button = screen.getByRole('button', { name: 'Delete workspace' });

    expect(button).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Type “Default” to confirm'), 'Default');
    await userEvent.click(button);

    expect(mutate).toHaveBeenCalledWith('Default');
  });
});
