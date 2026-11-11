import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OutsideAgentChanges } from '@/api/schema';
import type * as Workspaces from '@/features/workspaces';
import { useUpdateWorkspace } from '@/features/workspaces';
import { workspaceFixture } from '@/features/suggestions/testing/suggestion.fixture';
import { GeneralSettingsForm } from './GeneralSettingsForm';

vi.mock('@/features/workspaces', async (importOriginal) => ({
  ...(await importOriginal<typeof Workspaces>()),
  useUpdateWorkspace: vi.fn<typeof useUpdateWorkspace>(),
}));

const WORKSPACE = { ...workspaceFixture([]), timeZone: 'UTC' };

function renderForm() {
  const mutate = vi.fn<(changes: object) => void>();
  vi.mocked(useUpdateWorkspace).mockReturnValue({
    mutate,
    isPending: false,
    error: null,
  } as unknown as ReturnType<typeof useUpdateWorkspace>);
  render(<GeneralSettingsForm workspace={WORKSPACE} />);
  return mutate;
}

describe('GeneralSettingsForm', () => {
  it('starts on the saved values, with nothing to save', () => {
    renderForm();
    expect(screen.getByLabelText('Name')).toHaveValue(WORKSPACE.displayName);
    expect(screen.getByRole('radio', { name: /Wait for my approval/ })).toBeChecked();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('saves every change with one button, and only what changed', async () => {
    const mutate = renderForm();
    const name = screen.getByLabelText('Name');
    await userEvent.clear(name);
    await userEvent.type(name, 'Vintage finds');
    await userEvent.click(screen.getByRole('radio', { name: /Apply directly/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mutate).toHaveBeenCalledWith({
      name: 'Vintage finds',
      outsideAgentChanges: OutsideAgentChanges.apply_directly,
    });
  });

  it('will not save an empty name', async () => {
    renderForm();
    await userEvent.clear(screen.getByLabelText('Name'));
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });
});
