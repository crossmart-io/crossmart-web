import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { toAgentReviewRoute, ReviewSource } from '@/config/routes';
import { ATTENTION_COPY } from '../attention.constants';
import type { AttentionSummary } from '../attention.types';
import { useAttention } from '../hooks/useAttention';
import { NeedsAttention } from './NeedsAttention';

vi.mock('../hooks/useAttention', () => ({ useAttention: vi.fn<typeof useAttention>() }));

const EMPTY: AttentionSummary = {
  total: 0,
  stores: { count: 0, items: [] },
  listings: { count: 0, items: [] },
  proposals: null,
  suggestions: { count: 0, items: [] },
};

function renderWith(summary: AttentionSummary | undefined) {
  vi.mocked(useAttention).mockReturnValue({ data: summary } as ReturnType<typeof useAttention>);
  render(
    <MemoryRouter>
      <NeedsAttention workspaceId="ws-1" />
    </MemoryRouter>,
  );
}

describe('NeedsAttention', () => {
  it('says all is good, quietly, when nothing waits', () => {
    renderWith(EMPTY);
    expect(screen.getByText(ATTENTION_COPY.allGood)).toBeInTheDocument();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('lists what waits, with a link to where it is done', () => {
    renderWith({ ...EMPTY, total: 3, suggestions: { count: 3, items: [] } });
    expect(screen.getByRole('region', { name: ATTENTION_COPY.title })).toHaveTextContent('3');
    expect(screen.getByRole('link', { name: /Review/ })).toHaveAttribute(
      'href',
      toAgentReviewRoute(ReviewSource.Suggestions),
    );
  });

  it('shows nothing while loading', () => {
    renderWith(undefined);
    expect(screen.queryByText(ATTENTION_COPY.allGood)).not.toBeInTheDocument();
  });
});
