import { ListingDisplayState, PublishRequirement } from '@/api/schema';
import { FixTarget, GENERIC_PRODUCT_FIX } from '@/features/channels/publish-requirements';
import { listingFixOf, listingFixRoute } from './listing-fix';

const REF = { productId: 'p-1', connectionId: 'c-1' };

describe('listingFixOf', () => {
  it('has nothing to fix for states without a problem', () => {
    expect(
      listingFixOf({
        displayState: ListingDisplayState.published,
        missingRequirement: null,
        storeMissing: [PublishRequirement.shipping_policy],
      }),
    ).toBeNull();
  });

  it('leaves a failure the channel gave no reason for to "Try again"', () => {
    expect(
      listingFixOf({
        displayState: ListingDisplayState.failed,
        missingRequirement: null,
        storeMissing: [],
      }),
    ).toBeNull();
  });

  it('fixes what the channel refused the product for first', () => {
    const fix = listingFixOf({
      displayState: ListingDisplayState.failed,
      missingRequirement: PublishRequirement.category,
      storeMissing: [PublishRequirement.shipping_policy],
    });

    expect(fix?.target).toBe(FixTarget.StoreOverride);
  });

  it('points a product waiting on the store to the store’s first missing setting', () => {
    const fix = listingFixOf({
      displayState: ListingDisplayState.needs_details,
      missingRequirement: null,
      storeMissing: [PublishRequirement.payment_policy, PublishRequirement.return_policy],
    });

    expect(fix?.missing).toBe('Choose a payment policy');
  });

  it('falls back to the product when the store lacks nothing', () => {
    expect(
      listingFixOf({
        displayState: ListingDisplayState.needs_details,
        missingRequirement: null,
        storeMissing: [],
      }),
    ).toBe(GENERIC_PRODUCT_FIX);
  });
});

describe('listingFixRoute', () => {
  it.each([
    [PublishRequirement.reconnect, '/channels/c-1'],
    [PublishRequirement.account_settings, '/channels/c-1'],
    [PublishRequirement.shipping_policy, '/channels/c-1/settings#listing-defaults'],
    [PublishRequirement.payment_policy, '/channels/c-1/settings#listing-defaults'],
    [PublishRequirement.return_policy, '/channels/c-1/settings#listing-defaults'],
    [PublishRequirement.ship_from_location, '/channels/c-1/settings#listing-defaults'],
    [PublishRequirement.listing_setup, '/channels/c-1/settings#listing-setup'],
    [PublishRequirement.images, '/products/p-1#media'],
    [PublishRequirement.active_product, '/products/p-1#status'],
    [PublishRequirement.option_names, '/products/p-1#variants'],
    [PublishRequirement.category, '/products/p-1?override=c-1'],
    [PublishRequirement.item_specifics, '/products/p-1?override=c-1'],
  ])('sends %s to %s', (requirement, route) => {
    const fix = listingFixOf({
      displayState: ListingDisplayState.needs_details,
      missingRequirement: requirement,
      storeMissing: [],
    });

    expect(fix && listingFixRoute(fix, REF)).toBe(route);
  });
});
