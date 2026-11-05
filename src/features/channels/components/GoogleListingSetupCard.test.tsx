import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GoogleTargetCountry } from '@/api/schema';
import { fetchClient } from '@/api/client';
import type { GoogleMerchantSettings } from '../channels.types';
import { connectionFixture } from '../testing/channel-connection.fixture';
import { GoogleListingSetupCard } from './GoogleListingSetupCard';

vi.mock('@/api/client', () => ({ fetchClient: { PUT: vi.fn<typeof fetchClient.PUT>() } }));

const GOOGLE: GoogleMerchantSettings = {
  accountId: '123456789',
  accountName: 'Acme Goods',
  homepageUri: 'https://acme.example',
  homepageClaimed: false,
  country: GoogleTargetCountry.US,
  currencyCode: 'USD',
  contentLanguage: 'en',
  listingSetup: null,
  readyToList: false,
};

function renderCard(google = GOOGLE) {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <GoogleListingSetupCard
        workspaceId="ws-1"
        connectionId="c-1"
        googleMerchant={google}
        canManage
      />
    </QueryClientProvider>,
  );
}

describe('GoogleListingSetupCard', () => {
  it('saves the suggested setup and warns while the website is not claimed', async () => {
    vi.mocked(fetchClient.PUT).mockResolvedValue({
      data: connectionFixture({ googleMerchant: { ...GOOGLE, readyToList: true } }),
      error: undefined,
      response: new Response(),
    } as never);
    renderCard();

    expect(screen.getByText(/claim your website there before publishing/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Product page address')).toHaveValue(
      'https://acme.example/products/{handle}',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save setup' }));

    expect(fetchClient.PUT).toHaveBeenCalledWith(expect.any(String), {
      params: { path: { workspaceId: 'ws-1', connectionId: 'c-1' } },
      body: { country: 'US', productUrlTemplate: 'https://acme.example/products/{handle}' },
    });
  });

  it('asks for {handle} in the address before saving', async () => {
    renderCard({ ...GOOGLE, homepageUri: null, homepageClaimed: true });
    const address = screen.getByLabelText('Product page address');

    await userEvent.type(address, 'https://acme.example/products');
    await userEvent.click(screen.getByRole('button', { name: 'Save setup' }));

    expect(
      await screen.findByText('Enter an https address that contains {handle}'),
    ).toBeInTheDocument();
    expect(fetchClient.PUT).not.toHaveBeenCalled();
  });
});
