import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OutsideAgentChanges } from '@/api/schema';
import type * as Workspaces from '@/features/workspaces';
import { useUpdateWorkspace } from '@/features/workspaces';
import { workspaceFixture } from '@/features/suggestions/testing/suggestion.fixture';
import { OutsideAgentChangesCard } from './OutsideAgentChangesCard';

vi.mock('@/features/workspaces', async (importOriginal) => ({
  ...(await importOriginal<typeof Workspaces>()),
  useUpdateWorkspace: vi.fn<typeof useUpdateWorkspace>(),
}));

function renderCard() {
  const mutate = vi.fn<(changes: { outsideAgentChanges: OutsideAgentChanges }) => void>();
  vi.mocked(useUpdateWorkspace).mockReturnValue({
    mutate,
    isPending: false,
    error: null,
  } as unknown as ReturnType<typeof useUpdateWorkspace>);
  render(<OutsideAgentChangesCard workspace={workspaceFixture([])} />);
  return mutate;
}

describe('OutsideAgentChangesCard', () => {
  it('starts on the workspace’s choice, waiting for approval by default', () => {
    renderCard();
    expect(screen.getByRole('radio', { name: /Wait for my approval/ })).toBeChecked();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('saves a new choice', async () => {
    const mutate = renderCard();
    await userEvent.click(screen.getByRole('radio', { name: /Apply directly/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mutate).toHaveBeenCalledWith({
      outsideAgentChanges: OutsideAgentChanges.apply_directly,
    });
  });
});
