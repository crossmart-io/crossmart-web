import { ChannelProductState, ListingDisplayState } from '@/api/schema';
import { channelProductFilterQuery } from './channel-product-filter';
import { ALL_CHANNEL_PRODUCTS, NEEDS_DETAILS_FILTER } from './listings.constants';

describe('channelProductFilterQuery', () => {
  it('asks for every product when no state is chosen', () => {
    expect(channelProductFilterQuery(ALL_CHANNEL_PRODUCTS)).toEqual({});
  });

  it('asks for the products that need details by their display state', () => {
    expect(channelProductFilterQuery(NEEDS_DETAILS_FILTER)).toEqual({
      displayState: ListingDisplayState.needs_details,
    });
  });

  it.each([
    ChannelProductState.listed,
    ChannelProductState.pending,
    ChannelProductState.failed,
    ChannelProductState.removing,
    ChannelProductState.removed_by_hand,
  ] as const)('asks for the products in state %s', (state) => {
    expect(channelProductFilterQuery(state)).toEqual({ state });
  });
});
