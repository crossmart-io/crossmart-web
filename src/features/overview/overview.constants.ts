import { CHANNELS, isLiveChannel } from '@/features/channels';
import { formatAlternatives } from '@/lib/format';

/** Every channel a store can be connected to today, by name. */
const CONNECTABLE_CHANNEL_NAMES = CHANNELS.filter(isLiveChannel).map((channel) => channel.name);

/** "Connect Shopify or eBay to sync products and stock" */
export const CONNECT_CHANNEL_PROMPT = `Connect ${formatAlternatives(CONNECTABLE_CHANNEL_NAMES)} to sync products and stock`;

export const SALES_EMPTY_COPY = {
  title: 'No sales yet',
  description: 'Your sales will appear here once orders come in.',
} as const;
