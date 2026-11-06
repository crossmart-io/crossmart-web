import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ChannelConnectionStatus, PublishRequirement } from '@/api/schema';
import type { ChannelConnection } from '@/features/channels/channels.types';
import { PUBLISH_READINESS_COPY } from '@/features/channels/publish-requirements';
import {
  connectionFixture,
  ebayConnectionFixture,
} from '@/features/channels/testing/channel-connection.fixture';
import { PublishReadinessAlert } from './PublishReadinessAlert';

function renderAlert(connection: ChannelConnection, canManage = true) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <PublishReadinessAlert workspaceId="ws-1" connection={connection} canManage={canManage} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PublishReadinessAlert', () => {
  it('renders nothing for a store that can publish', () => {
    const { container } = renderAlert(connectionFixture());

    expect(container).toBeEmptyDOMElement();
  });

  it('lists what an eBay store lacks, each with a link to its settings card', () => {
    renderAlert(
      ebayConnectionFixture({
        publishReadiness: {
          ready: false,
          missing: [PublishRequirement.shipping_policy, PublishRequirement.ship_from_location],
        },
      }),
    );

    expect(screen.getByRole('alert')).toHaveTextContent(PUBLISH_READINESS_COPY.title);
    expect(screen.getByText(/Choose a shipping policy/)).toBeInTheDocument();
    expect(screen.getByText(/Set where items ship from/)).toBeInTheDocument();
    const links = screen.getAllByRole('link', { name: 'Open listing defaults' });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/channels/c-ebay/settings#listing-defaults');
  });

  it('leaves reconnecting to the reconnect alert', () => {
    const { container } = renderAlert(
      connectionFixture({
        status: ChannelConnectionStatus.NEEDS_REAUTH,
        publishReadiness: { ready: false, missing: [PublishRequirement.reconnect] },
      }),
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('tells members who cannot change the setup to ask an admin', () => {
    renderAlert(
      connectionFixture({
        publishReadiness: { ready: false, missing: [PublishRequirement.listing_setup] },
      }),
      false,
    );

    expect(screen.getByText(PUBLISH_READINESS_COPY.askAdmin)).toBeInTheDocument();
  });
});
