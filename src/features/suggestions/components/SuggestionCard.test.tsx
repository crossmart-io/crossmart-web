import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { SuggestionKind, SuggestionStatus } from '@/api/schema';
import { suggestionFixture } from '../testing/suggestion.fixture';
import type { Suggestion } from '../suggestions.types';
import { SuggestionCard, type SuggestionReviewActions } from './SuggestionCard';

function renderCard(suggestion: Suggestion, review?: SuggestionReviewActions) {
  render(
    <MemoryRouter>
      <SuggestionCard suggestion={suggestion} review={review} />
    </MemoryRouter>,
  );
}

function reviewActions(): SuggestionReviewActions {
  return {
    onApprove: vi.fn<(id: string) => void>(),
    onReject: vi.fn<(id: string) => void>(),
    busyId: undefined,
  };
}

describe('SuggestionCard', () => {
  it('shows what changes, where, who proposed it and why', () => {
    renderCard(suggestionFixture());

    expect(screen.getByRole('link', { name: 'Stoneware mug' })).toHaveAttribute(
      'href',
      '/products/p-1',
    );
    expect(screen.getByText(/eBay US · Content Generator, asked by Dana/)).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Names the material and size buyers filter by.')).toBeInTheDocument();
    const added = screen.getAllByText('stoneware mug, 350 ml', { selector: 'mark' });
    expect(added).toHaveLength(1);
  });

  it('approves and rejects a pending suggestion', async () => {
    const review = reviewActions();
    renderCard(suggestionFixture(), review);

    await userEvent.click(screen.getByRole('button', { name: 'Approve' }));
    await userEvent.click(screen.getByRole('button', { name: 'Reject' }));

    expect(review.onApprove).toHaveBeenCalledWith('s-1');
    expect(review.onReject).toHaveBeenCalledWith('s-1');
  });

  it('offers no review for someone who may not review, or once reviewed', () => {
    renderCard(suggestionFixture());
    expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument();
  });

  it('shows a reviewed suggestion’s status without actions', () => {
    renderCard(suggestionFixture({ status: SuggestionStatus.STALE }), reviewActions());

    expect(screen.getByText('Outdated')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument();
  });

  it('compares descriptions as text, never rendering their markup', () => {
    const { container } = render(
      <MemoryRouter>
        <SuggestionCard
          suggestion={suggestionFixture({
            kind: SuggestionKind.listing_description,
            currentValue: '<p>Old</p>',
            proposedValue: '<p>New</p><img src="x" onerror="alert(1)">',
          })}
        />
      </MemoryRouter>,
    );

    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('New', { selector: 'mark' })).toBeInTheDocument();
  });
});
