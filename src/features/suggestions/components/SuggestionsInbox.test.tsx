import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { WorkspacePermission } from '@/api/schema';
import { useAiStatus } from '../hooks/useAiStatus';
import { useSuggestions } from '../hooks/useSuggestions';
import { suggestionFixture, workspaceFixture } from '../testing/suggestion.fixture';
import type { Suggestion } from '../suggestions.types';
import { SuggestionsInbox } from './SuggestionsInbox';

vi.mock('../hooks/useAiStatus', () => ({ useAiStatus: vi.fn<typeof useAiStatus>() }));
vi.mock('../hooks/useSuggestions', () => ({ useSuggestions: vi.fn<typeof useSuggestions>() }));

const REVIEWER = workspaceFixture([
  WorkspacePermission.suggestions_view,
  WorkspacePermission.suggestions_approve,
]);

function renderInbox(suggestions: Suggestion[], configured = true, workspace = REVIEWER) {
  vi.mocked(useAiStatus).mockReturnValue({
    data: { configured, provider: 'anthropic', model: 'claude-sonnet-5-5' },
  } as ReturnType<typeof useAiStatus>);
  vi.mocked(useSuggestions).mockReturnValue({
    suggestions,
    total: suggestions.length,
    pageCount: 1,
    isPending: false,
    isError: false,
    isPlaceholderData: false,
  } as unknown as ReturnType<typeof useSuggestions>);
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <SuggestionsInbox workspace={workspace} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('SuggestionsInbox', () => {
  it('explains where suggestions come from when there is nothing to review', () => {
    renderInbox([]);

    expect(screen.getByText('Nothing to review')).toBeInTheDocument();
  });

  it('says AI is not configured instead, when it is not', () => {
    renderInbox([], false);

    expect(screen.getByText('AI is not configured')).toBeInTheDocument();
    expect(screen.queryByText('Nothing to review')).not.toBeInTheDocument();
  });

  it('lets a reviewer select suggestions and approve them in bulk', async () => {
    renderInbox([suggestionFixture(), suggestionFixture({ id: 's-2' })]);

    await userEvent.click(screen.getByRole('button', { name: 'Select all on this page' }));

    expect(screen.getByRole('region', { name: 'Bulk review' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Approve 2 suggestions' })).toBeInTheDocument();
  });

  it('shows suggestions without review actions to someone who may only look', () => {
    renderInbox(
      [suggestionFixture()],
      true,
      workspaceFixture([WorkspacePermission.suggestions_view]),
    );

    expect(screen.getByText('Stoneware mug')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
