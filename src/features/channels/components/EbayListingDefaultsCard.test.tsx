import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EbayCondition, EbayMarketplaceId } from '@/api/schema';
import type { EbaySettings } from '../channels.types';
import {
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
  return { save, optIn, refresh };
}

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
    renderCard({
      ...SETTINGS,
      businessPoliciesEnabled: false,
      policies: { fulfillment: [], payment: [], return: [] },
      listingDefaults: NO_EBAY_DEFAULTS,
    });

    await userEvent.click(screen.getByRole('button', { name: 'Opt in to business policies' }));
    await userEvent.click(screen.getByRole('button', { name: 'Refresh policies' }));

    expect(optIn).toHaveBeenCalled();
    expect(refresh).toHaveBeenCalled();
    expect(screen.getAllByText('No policies yet')).toHaveLength(3);
  });

  it('is read-only for those who may not manage the store', () => {
    mockMutations();
    renderCard({ ...SETTINGS, readyToList: true }, false);

    expect(screen.getByText(/Ready to list/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save defaults' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Refresh policies' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Postal code')).toBeDisabled();
  });
});
