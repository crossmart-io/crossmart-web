import {
  ChannelConnectionStatus,
  ListingDisplayState,
  ProductStatus,
  PublishRequirement,
} from '@/api/schema';
import { ApiRequestError } from '@/api/api-error';
import { toProductRoute, toProductStoreOverrideRoute } from '@/config/routes';
import { connectionFixture } from '@/features/channels/testing/channel-connection.fixture';
import {
  pageAfterPublish,
  PublishAvailability,
  publishResultOf,
  publishStoreOf,
  takesEveryActiveProduct,
} from './publish-on-create';
import { productChannelFixture } from './testing/listing.fixture';

const RULE = { includeProductIds: [], excludeProductIds: [] };

describe('takesEveryActiveProduct', () => {
  it('is true for "all products" and for "active products" only', () => {
    expect(takesEveryActiveProduct({ ...RULE, filter: {} })).toBe(true);
    expect(takesEveryActiveProduct({ ...RULE, filter: { status: ProductStatus.ACTIVE } })).toBe(
      true,
    );
  });

  it('is false when the rule is off or narrower', () => {
    expect(takesEveryActiveProduct(null)).toBe(false);
    expect(takesEveryActiveProduct({ ...RULE, filter: null })).toBe(false);
    expect(takesEveryActiveProduct({ ...RULE, filter: { tags: ['vintage'] } })).toBe(false);
    expect(takesEveryActiveProduct({ ...RULE, filter: { status: ProductStatus.DRAFT } })).toBe(
      false,
    );
  });
});

describe('publishStoreOf', () => {
  it('needs a reconnect before anything else', () => {
    const connection = connectionFixture({ status: ChannelConnectionStatus.NEEDS_REAUTH });
    expect(publishStoreOf(connection).availability).toBe(PublishAvailability.NeedsReconnect);
  });

  it('leaves stores with an automatic rule to the rule', () => {
    const connection = connectionFixture({ productSelection: { ...RULE, filter: {} } });
    expect(publishStoreOf(connection).availability).toBe(PublishAvailability.Automatic);
    expect(publishStoreOf(connectionFixture()).availability).toBe(PublishAvailability.Ready);
  });
});

describe('publishResultOf', () => {
  it('keeps what was added and names each store that refused', () => {
    const stores = [
      publishStoreOf(connectionFixture({ id: 'c-1', displayName: 'Main shop' })),
      publishStoreOf(connectionFixture({ id: 'c-2', displayName: 'eBay US' })),
    ];
    const added = productChannelFixture();
    const refused = new ApiRequestError('Plan limit reached', 402);
    const result = publishResultOf(stores, [
      { status: 'fulfilled', value: added },
      { status: 'rejected', reason: refused },
    ]);
    expect(result.added).toEqual([added]);
    expect(result.failures).toEqual([{ storeName: 'eBay US', message: 'Plan limit reached' }]);
  });
});

describe('pageAfterPublish', () => {
  it('opens the listing a store needs a category for', () => {
    const channel = productChannelFixture({
      displayState: ListingDisplayState.needs_details,
      displayRequirement: PublishRequirement.category,
    });
    expect(pageAfterPublish('p-1', [channel])).toBe(
      toProductStoreOverrideRoute('p-1', channel.connection.id),
    );
  });

  it('opens the plain page when nothing is missing, or the fix is the store’s', () => {
    const storeFix = productChannelFixture({
      displayState: ListingDisplayState.needs_details,
      displayRequirement: PublishRequirement.shipping_policy,
    });
    expect(pageAfterPublish('p-1', [productChannelFixture(), storeFix])).toBe(
      toProductRoute('p-1'),
    );
  });
});
