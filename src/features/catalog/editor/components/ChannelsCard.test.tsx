import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ChannelConnectionStatus } from '@/api/schema';
import { useChannelConnections } from '@/features/channels/hooks/useChannelConnections';
import { NEW_PRODUCT_CHANNELS_COPY } from '../../catalog.constants';
import { ChannelsCard } from './ChannelsCard';

vi.mock('@/features/channels/hooks/useChannelConnections', () => ({
  useChannelConnections: vi.fn<typeof useChannelConnections>(),
}));

function renderWith(statuses: ChannelConnectionStatus[]) {
  vi.mocked(useChannelConnections).mockReturnValue({
    data: statuses.map((status) => ({ status })),
  } as unknown as ReturnType<typeof useChannelConnections>);
  render(
    <MemoryRouter>
      <ChannelsCard workspaceId="ws-1" />
    </MemoryRouter>,
  );
}

describe('ChannelsCard', () => {
  it('asks to save first when stores are connected', () => {
    renderWith([ChannelConnectionStatus.CONNECTED]);

    expect(screen.getByText(NEW_PRODUCT_CHANNELS_COPY.saveFirst)).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: NEW_PRODUCT_CHANNELS_COPY.connect }),
    ).not.toBeInTheDocument();
  });

  it('sends the seller to connect a store when none is connected', () => {
    renderWith([ChannelConnectionStatus.DISCONNECTED]);
    expect(
      screen.getByRole('link', { name: NEW_PRODUCT_CHANNELS_COPY.connect }),
    ).toBeInTheDocument();
  });
});
