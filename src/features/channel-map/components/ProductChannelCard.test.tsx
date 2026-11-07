import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ListingDisplayState, PriceSource } from '@/api/schema';
import {
  channelVariantFixture,
  productChannelFixture,
} from '@/features/listings/testing/listing.fixture';
import { ProductChannelCard } from './ProductChannelCard';

describe('ProductChannelCard', () => {
  it.each([
    [ListingDisplayState.published, 'Published'],
    [ListingDisplayState.publishing, 'Publishing'],
    [ListingDisplayState.needs_details, 'Needs details'],
    [ListingDisplayState.failed, 'Failed'],
    [ListingDisplayState.draft, 'Draft'],
  ])('says the %s state in words, not by colour alone', (displayState, label) => {
    render(
      <ProductChannelCard
        channel={productChannelFixture({ displayState })}
        suggestionCount={0}
        onOpen={vi.fn<(id: string) => void>()}
      />,
    );
    const node = screen.getByRole('button', { name: `demo-store: ${label}. Open details` });
    expect(node).toHaveAttribute('data-state', displayState);
    expect(node).toHaveTextContent(label);
  });

  it('shows why a listing failed, its price, stock and suggestions', () => {
    render(
      <ProductChannelCard
        channel={productChannelFixture({
          displayState: ListingDisplayState.failed,
          displayReason: 'The handle is taken',
          variants: [
            channelVariantFixture({
              quantity: 7,
              price: { ...channelVariantFixture().price, source: PriceSource.override },
            }),
          ],
        })}
        suggestionCount={2}
        onOpen={vi.fn<(id: string) => void>()}
      />,
    );
    expect(screen.getByText('The handle is taken')).toBeInTheDocument();
    expect(screen.getByText('$64.00')).toBeInTheDocument();
    expect(screen.getByText('7 in stock')).toBeInTheDocument();
    expect(screen.getByText('Custom for this store')).toBeInTheDocument();
    expect(screen.getByText('2 AI suggestions')).toBeInTheDocument();
  });

  it('opens the store’s details', async () => {
    const onOpen = vi.fn<(id: string) => void>();
    render(
      <ProductChannelCard channel={productChannelFixture()} suggestionCount={0} onOpen={onOpen} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /demo-store/ }));
    expect(onOpen).toHaveBeenCalledWith('c-1');
  });
});
