import { CHANNELS } from '@/features/channels';
import { formatAlternatives } from '@/lib/format';

/** Every channel a store can be connected to today, by name. */
const CONNECTABLE_CHANNEL_NAMES = CHANNELS.filter((channel) => channel.connect).map(
  (channel) => channel.name,
);

/** "Connect Shopify, eBay or Google Merchant Center to sync products and stock" */
export const CONNECT_CHANNEL_PROMPT = `Connect ${formatAlternatives(CONNECTABLE_CHANNEL_NAMES)} to sync products and stock`;

export const SALES_EMPTY_COPY = {
  title: 'No sales yet',
  description: 'Your sales will appear here once orders come in.',
} as const;

export const CATALOG_HEALTH_EMPTY_COPY = {
  title: 'No products yet',
  description: 'Add or import products to see what marketplaces still need from them.',
  addProduct: 'Add product',
  importProducts: 'Import',
} as const;
