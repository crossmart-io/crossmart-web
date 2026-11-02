import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from './ConfirmDialog';

function renderDialog(onConfirm: () => Promise<unknown>) {
  render(
    <ConfirmDialog
      trigger={<Button>Delete</Button>}
      title="Delete mug?"
      description="This cannot be undone."
      confirmLabel="Delete product"
      onConfirm={onConfirm}
    />,
  );
}

describe('ConfirmDialog', () => {
  it('closes once the action succeeds', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn<() => Promise<unknown>>().mockResolvedValue(undefined);
    renderDialog(onConfirm);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Delete product' }));

    expect(onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('stays open after a failure so the user can retry', async () => {
    const user = userEvent.setup();
    renderDialog(() => Promise.reject(new Error('Network down')));

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Delete product' }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Delete product' })).toBeEnabled(),
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });
});
