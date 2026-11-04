import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChannelFeature, ChannelType } from '@/api/schema';
import type * as ConnectionHooks from '../hooks/useChannelConnections';
import { useStartChannelAuthorization } from '../hooks/useChannelConnections';
import { connectionFixture } from '../testing/channel-connection.fixture';
import { MissingFeaturesAlert } from './MissingFeaturesAlert';

vi.mock('../hooks/useChannelConnections', async (importOriginal) => ({
  ...(await importOriginal<typeof ConnectionHooks>()),
  useStartChannelAuthorization: vi.fn<typeof useStartChannelAuthorization>(),
}));

function renderAlert(missingFeatures: ChannelFeature[], canManage = true) {
  const authorize = vi.fn<() => void>();
  vi.mocked(useStartChannelAuthorization).mockReturnValue({
    mutate: authorize,
    isPending: false,
  } as unknown as ReturnType<typeof useStartChannelAuthorization>);
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MissingFeaturesAlert
        workspaceId="ws-1"
        connection={connectionFixture({ missingFeatures })}
        canManage={canManage}
      />
    </QueryClientProvider>,
  );
  return authorize;
}

describe('MissingFeaturesAlert', () => {
  it('sends an admin to approve the permission on the store', async () => {
    const authorize = renderAlert([ChannelFeature.storefront_visibility]);

    expect(screen.getByText('Products are not shown in your Online Store yet')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Approve in Shopify' }));

    expect(authorize).toHaveBeenCalledWith({
      channel: ChannelType.shopify,
      accountHandle: 'demo-store.myshopify.com',
    });
  });

  it('asks other members to get an admin, and says nothing when nothing is missing', () => {
    renderAlert([ChannelFeature.storefront_visibility], false);
    expect(screen.queryByRole('button', { name: 'Approve in Shopify' })).not.toBeInTheDocument();
    expect(screen.getByText(/until a workspace admin approves/)).toBeInTheDocument();
  });

  it('renders nothing for a store with every permission', () => {
    const { container } = render(
      <MissingFeaturesAlert workspaceId="ws-1" connection={connectionFixture()} canManage />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
