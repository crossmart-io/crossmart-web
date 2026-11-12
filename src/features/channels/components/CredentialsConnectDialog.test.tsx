import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChannelType } from '@/api/schema';
import {
  CHANNELS,
  type ChannelInfo,
  ConnectMethod,
  CREDENTIALS_DIALOG_COPY,
  type CredentialsConnectableChannel,
} from '../channels.constants';
import type * as ConnectionHooks from '../hooks/useChannelConnections';
import { useConnectWithCredentials } from '../hooks/useChannelConnections';
import { ConnectChannelDialog } from './ConnectChannelDialog';

vi.mock('../hooks/useChannelConnections', async (importOriginal) => ({
  ...(await importOriginal<typeof ConnectionHooks>()),
  useConnectWithCredentials: vi.fn<typeof useConnectWithCredentials>(),
}));

function falabella(): { channel: ChannelInfo; connect: CredentialsConnectableChannel } {
  const channel = CHANNELS.find((info) => info.connect?.type === ChannelType.falabella);
  const connect = channel?.connect;
  if (!channel || connect?.method !== ConnectMethod.Credentials) {
    throw new Error('Falabella is not connected with credentials');
  }
  return { channel, connect };
}

function renderDialog(error: Error | null = null) {
  vi.mocked(useConnectWithCredentials).mockReturnValue({
    mutate: vi.fn<() => void>(),
    reset: vi.fn<() => void>(),
    isPending: false,
    error,
  } as unknown as ReturnType<typeof useConnectWithCredentials>);
  const { channel, connect } = falabella();
  render(<ConnectChannelDialog workspaceId="ws-1" channel={channel} connect={connect} open />);
}

describe('CredentialsConnectDialog', () => {
  it('asks for the seller id, user, a masked API key and the country, with a guide', async () => {
    renderDialog();

    expect(screen.getByRole('heading', { name: 'Connect Falabella' })).toBeInTheDocument();
    expect(screen.getByLabelText('API key')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: CREDENTIALS_DIALOG_COPY.guide })).toHaveAttribute(
      'href',
      falabella().connect.guideUrl,
    );
    const submit = screen.getByRole('button', { name: CREDENTIALS_DIALOG_COPY.submit });
    await userEvent.type(screen.getByLabelText('Seller ID'), 'SC478FA');
    await userEvent.type(screen.getByLabelText('User ID'), 'me@shop.cl');
    await userEvent.type(screen.getByLabelText('API key'), 'key');
    expect(submit).toBeDisabled();
  });

  it('shows why Falabella refused the details', () => {
    renderDialog(new Error('Those details were rejected.'));

    expect(screen.getByText('Those details were rejected.')).toBeInTheDocument();
  });
});
