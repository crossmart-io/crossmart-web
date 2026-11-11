import { ChannelType, ConnectFailure } from '@/api/schema';
import { parseEnum } from '@/lib/enum';
import { CHANNELS, CONNECT_FAILURE_MESSAGES } from './channels.constants';
import type { ConnectRedirect } from './channels.types';

/** The parameters the OAuth callback adds, named by the generated redirect type. */
export const CONNECT_REDIRECT_PARAMS = {
  connected: 'connected',
  connectionId: 'connectionId',
  reconnected: 'reconnected',
  error: 'error',
  channel: 'channel',
} as const satisfies Record<keyof ConnectRedirect, keyof ConnectRedirect>;

/** The value the API sends for a flag such as `reconnected=true`. */
const FLAG_SET = String(true);

/**
 * A connection the merchant just made. The API names the connection and says whether it was a
 * re-auth; an older API sends only the channel, so `connectionId` may be missing.
 */
export interface ConnectedOutcome {
  kind: 'connected';
  message: string;
  channel: ChannelType;
  connectionId: string | null;
  reconnected: boolean;
}

type ConnectOutcome = ConnectedOutcome | { kind: 'failed'; message: string };

function channelName(type: ChannelType | undefined): string {
  return CHANNELS.find((channel) => channel.connect?.type === type)?.name ?? 'The store';
}

/** What to tell the merchant about the redirect they just came back with, if anything. */
export function readConnectOutcome(params: URLSearchParams): ConnectOutcome | null {
  const connected = parseEnum(ChannelType, params.get(CONNECT_REDIRECT_PARAMS.connected));
  if (connected) {
    return {
      kind: 'connected',
      message: `${channelName(connected)} is connected`,
      channel: connected,
      connectionId: params.get(CONNECT_REDIRECT_PARAMS.connectionId) || null,
      reconnected: params.get(CONNECT_REDIRECT_PARAMS.reconnected) === FLAG_SET,
    };
  }
  const raw = params.get(CONNECT_REDIRECT_PARAMS.error);
  if (raw === null) return null;
  const failure = parseEnum(ConnectFailure, raw) ?? ConnectFailure.unexpected;
  return { kind: 'failed', message: CONNECT_FAILURE_MESSAGES[failure] };
}
