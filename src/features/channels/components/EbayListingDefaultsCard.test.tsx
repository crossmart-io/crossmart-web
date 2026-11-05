import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EbayCondition, EbayMarketplaceId } from '@/api/schema';
import type { ChannelConnection, EbaySettings } from '../channels.types';
import {
  useCreateEbayDefaultPolicies,
  useOptInToEbayPolicies,
  useRefreshEbayPolicies,
  useSaveEbayDefaults,
} from '../hooks/useEbaySetup';
import { NO_EBAY_DEFAULTS } from '../testing/channel-connection.fixture';
import { EbayListingDefaultsCard } from './EbayListingDefaultsCard';

vi.mock('../hooks/useEbaySetup', () => ({
  useSaveEbayDefaults: vi.fn<typeof useSaveEbayDefaults>(),
  useOptInToEbayPolicies: vi.fn<typeof useOptInToEbayPolicies>(),
  useRefreshEbayPolicies: vi.fn<typeof useRefreshEbayPolicies>(),
  useCreateEbayDefaultPolicies: vi.fn<typeof useCreateEbayDefaultPolicies>(),
}));

const SETTINGS: EbaySettings = {
  marketplaceId: EbayMarketplaceId.EBAY_US,
  currencyCode: 'USD',
  username: 'demo_seller',
  userId: 'u-1',
  businessPoliciesEnabled: true,
  policies: {
    fulfillment: [{ id: 'f-1', name: 'Free shipping' }],
    payment: [{ id: 'p-1', name: 'Managed payments' }],
    return: [{ id: 'r-1', name: '30 days' }],
  },
  listingDefaults: {
    ...NO_EBAY_DEFAULTS,
    fulfillmentPolicyId: 'f-1',
    paymentPolicyId: 'p-1',
    returnPolicyId: 'r-1',
  },
  readyToList: false,
};

function mockMutations() {
  const save = vi.fn<(body: unknown) => Promise<unknown>>().mockResolvedValue({ ebay: SETTINGS });
  const optIn = vi.fn<() => void>();
  const refresh = vi.fn<() => void>();
  vi.mocked(useSaveEbayDefaults).mockReturnValue({ mutateAsync: save, error: null } as never);
  vi.mocked(useOptInToEbayPolicies).mockReturnValue({ mutate: optIn, isPending: false } as never);
  vi.mocked(useRefreshEbayPolicies).mockReturnValue({
    mutate: refresh,
    isPending: false,
  } as never);
  const createDefaults = vi.fn<(variables: undefined, options: CreateOptions) => void>();
  vi.mocked(useCreateEbayDefaultPolicies).mockReturnValue({
    mutate: createDefaults,
    isPending: false,
  } as never);
  return { save, optIn, refresh, createDefaults };
}

interface CreateOptions {
  onSuccess: (connection: ChannelConnection) => void;
}

const NO_POLICIES: EbaySettings = {
  ...SETTINGS,
  businessPoliciesEnabled: false,
  policies: { fulfillment: [], payment: [], return: [] },
  listingDefaults: NO_EBAY_DEFAULTS,
};

/** The account once Crossmart created its default policies and chose them. */
const WITH_DEFAULTS: EbaySettings = {
  ...SETTINGS,
  policies: {
    fulfillment: [{ id: 'f-9', name: 'Crossmart standard shipping' }],
    payment: [{ id: 'p-9', name: 'Crossmart payment' }],
    return: [{ id: 'r-9', name: 'Crossmart 30-day returns' }],
  },
  listingDefaults: {
    ...NO_EBAY_DEFAULTS,
    fulfillmentPolicyId: 'f-9',
    paymentPolicyId: 'p-9',
    returnPolicyId: 'r-9',
  },
};

function renderCard(ebay: EbaySettings = SETTINGS, canManage = true) {
  return render(
    <EbayListingDefaultsCard
      workspaceId="ws-1"
      connectionId="c-1"
      ebay={ebay}
      canManage={canManage}
    />,
  );
}

describe('EbayListingDefaultsCard', () => {
  it('shows the policies listings use and says what is missing to list', () => {
    mockMutations();
    renderCard();

    expect(screen.getByLabelText('Shipping policy')).toHaveTextContent('Free shipping');
    expect(screen.getByLabelText('Payment policy')).toHaveTextContent('Managed payments');
    expect(screen.getByText(/where items ship from before publishing/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Manage policies on eBay/ })).toHaveAttribute(
      'href',
      'https://www.ebay.com/bp/manage',
    );
  });

  it('saves the ship-from address with the defaults', async () => {
    const { save } = mockMutations();
    renderCard();

    await userEvent.type(screen.getByLabelText('Postal code'), '95125');
    await userEvent.type(screen.getByLabelText('Country'), 'us');
    await userEvent.click(screen.getByRole('button', { name: 'Save defaults' }));

    expect(save).toHaveBeenCalledWith({
      fulfillmentPolicyId: 'f-1',
      paymentPolicyId: 'p-1',
      returnPolicyId: 'r-1',
      condition: EbayCondition.NEW,
      location: { postalCode: '95125', country: 'US', city: null },
    });
  });

  it('offers to opt in when business policies are off, and refreshes them', async () => {
    const { optIn, refresh } = mockMutations();
    renderCard(NO_POLICIES);

    await userEvent.click(screen.getByRole('button', { name: 'Opt in to business policies' }));
    await userEvent.click(screen.getByRole('button', { name: 'Refresh policies' }));

    expect(optIn).toHaveBeenCalled();
    expect(refresh).toHaveBeenCalled();
    expect(screen.getAllByText('No policies yet')).toHaveLength(3);
  });

  it('offers to create default policies first when the account lacks some, then shows them chosen', async () => {
    const { createDefaults } = mockMutations();
    createDefaults.mockImplementation((_variables, options) =>
      options.onSuccess({ ebay: WITH_DEFAULTS } as ChannelConnection),
    );
    const { rerender } = renderCard(NO_POLICIES);

    const create = screen.getByRole('button', { name: 'Create default policies' });
    expect(create).toHaveAttribute('data-variant', 'default');
    expect(screen.getByText(/free shipping, immediate payment and 30-day returns/)).toBeVisible();
    await userEvent.click(create);
    rerender(
      <EbayListingDefaultsCard
        workspaceId="ws-1"
        connectionId="c-1"
        ebay={WITH_DEFAULTS}
        canManage
      />,
    );

    expect(createDefaults).toHaveBeenCalled();
    expect(screen.getByLabelText('Shipping policy')).toHaveTextContent(
      'Crossmart standard shipping',
    );
    expect(screen.getByLabelText('Payment policy')).toHaveTextContent('Crossmart payment');
    expect(screen.getByLabelText('Return policy')).toHaveTextContent('Crossmart 30-day returns');
    expect(screen.getByRole('button', { name: 'Save defaults' })).toBeDisabled();
  });

  it('keeps creating default policies a secondary action when every policy exists', () => {
    mockMutations();
    renderCard();

    expect(screen.getByRole('button', { name: 'Create default policies' })).toHaveAttribute(
      'data-variant',
      'outline',
    );
  });

  it('is read-only for those who may not manage the store', () => {
    mockMutations();
    renderCard({ ...SETTINGS, readyToList: true }, false);

    expect(screen.getByText(/Ready to list/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save defaults' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Refresh policies' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Create default policies' }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('Postal code')).toBeDisabled();
  });
});
