import { ChannelType, ConnectFailure } from '@/api/schema';
import { parseEnum } from '@/lib/enum';
import { CHANNELS, CONNECT_FAILURE_MESSAGES } from './channels.constants';
import type { ConnectRedirect } from './channels.types';

/** The parameters the OAuth callback adds, named by the generated redirect type. */
export const CONNECT_REDIRECT_PARAMS = {
  connected: 'connected',
  error: 'error',
  channel: 'channel',
} as const satisfies Record<keyof ConnectRedirect, keyof ConnectRedirect>;

type ConnectOutcome = { kind: 'connected'; message: string } | { kind: 'failed'; message: string };

function channelName(type: ChannelType | undefined): string {
  return CHANNELS.find((channel) => channel.connect?.type === type)?.name ?? 'The channel';
}

/** What to tell the merchant about the redirect they just came back with, if anything. */
export function readConnectOutcome(params: URLSearchParams): ConnectOutcome | null {
  const connected = parseEnum(ChannelType, params.get(CONNECT_REDIRECT_PARAMS.connected));
  if (connected) {
    return { kind: 'connected', message: `${channelName(connected)} is connected` };
  }
  const raw = params.get(CONNECT_REDIRECT_PARAMS.error);
  if (raw === null) return null;
  const failure = parseEnum(ConnectFailure, raw) ?? ConnectFailure.unexpected;
  return { kind: 'failed', message: CONNECT_FAILURE_MESSAGES[failure] };
}
