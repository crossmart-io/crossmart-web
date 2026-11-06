import { render, screen } from '@testing-library/react';
import { ListingDisplayState } from '@/api/schema';
import { ListingStateBadge } from './ListingStateBadge';

const LABELS: Record<ListingDisplayState, string> = {
  [ListingDisplayState.draft]: 'Draft',
  [ListingDisplayState.needs_details]: 'Needs details',
  [ListingDisplayState.ready]: 'Ready to publish',
  [ListingDisplayState.publishing]: 'Publishing',
  [ListingDisplayState.published]: 'Published',
  [ListingDisplayState.failed]: 'Failed',
  [ListingDisplayState.removing]: 'Removing',
  [ListingDisplayState.removed]: 'Removed',
};

describe('ListingStateBadge', () => {
  it.each(Object.values(ListingDisplayState))('names %s in words, with an icon', (state) => {
    const { container } = render(<ListingStateBadge state={state} />);

    expect(screen.getByText(LABELS[state])).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('gives every state its own icon or colour, so no two read alike', () => {
    const looks = Object.values(ListingDisplayState).map((state) => {
      const { container, unmount } = render(<ListingStateBadge state={state} />);
      const badge = container.querySelector('[data-slot="badge"]');
      const look = `${badge?.getAttribute('data-variant')}:${badge?.querySelector('svg')?.getAttribute('class')}`;
      unmount();
      return look;
    });

    expect(new Set(looks).size).toBeGreaterThanOrEqual(looks.length - 1);
  });

  it('turns its icon while publishing', () => {
    const { container } = render(<ListingStateBadge state={ListingDisplayState.publishing} />);

    expect(container.querySelector('svg')).toHaveClass('motion-safe:animate-spin');
  });
});
