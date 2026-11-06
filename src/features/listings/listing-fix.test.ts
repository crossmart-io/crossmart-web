import { ListingDisplayState, PublishRequirement } from '@/api/schema';
import { FixTarget, GENERIC_PRODUCT_FIX } from '@/features/channels/publish-requirements';
import { listingFixOf, listingFixRoute } from './listing-fix';

const REF = { productId: 'p-1', connectionId: 'c-1' };

describe('listingFixOf', () => {
  it('has nothing to fix for states without a problem', () => {
    expect(
      listingFixOf({
        displayState: ListingDisplayState.published,
        displayRequirement: null,
        missingRequirement: null,
      }),
    ).toBeNull();
  });

  it('leaves a failure the channel gave no reason for to "Try again"', () => {
    expect(
      listingFixOf({
        displayState: ListingDisplayState.failed,
        displayRequirement: null,
        missingRequirement: null,
      }),
    ).toBeNull();
  });

  it('fixes what the channel refused a failed publish for', () => {
    const fix = listingFixOf({
      displayState: ListingDisplayState.failed,
      displayRequirement: null,
      missingRequirement: PublishRequirement.category,
    });

    expect(fix?.target).toBe(FixTarget.StoreOverride);
  });

  it('fixes what the server says to fix first, ahead of an older refusal', () => {
    const fix = listingFixOf({
      displayState: ListingDisplayState.needs_details,
      displayRequirement: PublishRequirement.payment_policy,
      missingRequirement: PublishRequirement.category,
    });

    expect(fix?.missing).toBe('Choose a payment policy');
  });

  it.each([
    [PublishRequirement.images, 'Add a photo'],
    [PublishRequirement.active_product, 'Change status'],
    [PublishRequirement.option_names, 'Name the options'],
  ])(
    'sends a product blocked on %s to the exact fix, not the generic one',
    (requirement, action) => {
      const fix = listingFixOf({
        displayState: ListingDisplayState.needs_details,
        displayRequirement: requirement,
        missingRequirement: null,
      });

      expect(fix?.action).toBe(action);
      expect(fix).not.toBe(GENERIC_PRODUCT_FIX);
    },
  );

  it('falls back to the product editor when the server names nothing', () => {
    expect(
      listingFixOf({
        displayState: ListingDisplayState.needs_details,
        displayRequirement: null,
        missingRequirement: null,
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
      displayRequirement: requirement,
      missingRequirement: null,
    });

    expect(fix && listingFixRoute(fix, REF)).toBe(route);
  });
});
