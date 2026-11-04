import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkspacePermission } from '@/api/schema';
import { PermissionChecklist } from './PermissionChecklist';

function renderChecklist(available: WorkspacePermission[]) {
  const onChange = vi.fn<(permissions: WorkspacePermission[]) => void>();
  render(
    <PermissionChecklist
      value={[WorkspacePermission.inventory_view]}
      onChange={onChange}
      available={available}
    />,
  );
  return { onChange };
}

describe('PermissionChecklist', () => {
  it('keeps opening the workspace on and fixed', () => {
    renderChecklist(Object.values(WorkspacePermission));
    const open = screen.getByRole('checkbox', { name: 'Open the workspace' });
    expect(open).toBeChecked();
    expect(open).toBeDisabled();
  });

  it('adds a permission the user has', async () => {
    const { onChange } = renderChecklist(Object.values(WorkspacePermission));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Adjust and import stock' }));
    expect(onChange).toHaveBeenCalledWith([
      WorkspacePermission.inventory_view,
      WorkspacePermission.inventory_edit,
    ]);
  });

  it('locks permissions the user lacks', () => {
    renderChecklist([WorkspacePermission.inventory_view]);
    expect(screen.getByRole('checkbox', { name: 'Adjust and import stock' })).toBeDisabled();
    expect(screen.queryByText('Delete the workspace')).not.toBeInTheDocument();
  });
});
