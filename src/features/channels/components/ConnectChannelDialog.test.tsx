import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChannelType, EbayMarketplaceId } from '@/api/schema';
import { CHANNELS, type ChannelInfo, type ConnectableChannel } from '../channels.constants';
import type * as ConnectionHooks from '../hooks/useChannelConnections';
import { useStartChannelAuthorization } from '../hooks/useChannelConnections';
import { ConnectChannelDialog } from './ConnectChannelDialog';

vi.mock('../hooks/useChannelConnections', async (importOriginal) => ({
  ...(await importOriginal<typeof ConnectionHooks>()),
  useStartChannelAuthorization: vi.fn<typeof useStartChannelAuthorization>(),
}));

function ebayChannel(): { channel: ChannelInfo; connect: ConnectableChannel } {
  const channel = CHANNELS.find((info) => info.connect?.type === ChannelType.ebay);
  if (!channel?.connect) throw new Error('eBay is not connectable');
  return { channel, connect: channel.connect };
}

function renderDialog(initialAccount?: string) {
  const authorize = vi.fn<() => void>();
  vi.mocked(useStartChannelAuthorization).mockReturnValue({
    mutate: authorize,
    reset: vi.fn<() => void>(),
    isPending: false,
    isSuccess: false,
    error: null,
  } as unknown as ReturnType<typeof useStartChannelAuthorization>);
  const { channel, connect } = ebayChannel();
  render(
    <ConnectChannelDialog
      workspaceId="ws-1"
      channel={channel}
      connect={connect}
      open
      initialAccount={initialAccount}
    />,
  );
  return authorize;
}

describe('ConnectChannelDialog', () => {
  it('asks for an eBay marketplace from a list, not a typed account', () => {
    renderDialog();

    const marketplace = screen.getByRole('combobox', { name: 'Marketplace' });
    expect(marketplace).toHaveTextContent('Choose a marketplace');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue to eBay' })).toBeDisabled();
  });

  it('starts the eBay sign-in for the chosen marketplace', async () => {
    const authorize = renderDialog(EbayMarketplaceId.EBAY_GB);

    expect(screen.getByRole('combobox', { name: 'Marketplace' })).toHaveTextContent(
      'eBay UK (GBP)',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Continue to eBay' }));

    expect(authorize).toHaveBeenCalledWith({
      channel: ChannelType.ebay,
      accountHandle: EbayMarketplaceId.EBAY_GB,
    });
  });
});
