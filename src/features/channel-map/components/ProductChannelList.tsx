import type { ProductMapInput } from '../product-map-graph';
import { liveStoreCount } from '../map-status';
import { ProductHubCard } from './ProductHubNode';
import { ProductChannelCard } from './ProductChannelCard';

/**
 * The product's map as a list: the product, then each store as the same card the graph draws.
 * Shown on narrow screens, and to anyone who prefers reading it row by row.
 */
export function ProductChannelList({
  product,
  channels,
  suggestionCounts,
  onOpen,
}: ProductMapInput) {
  const live = liveStoreCount(channels.map((channel) => channel.displayState));
  return (
    <div className="flex flex-col gap-3">
      <ProductHubCard {...product} live={live} total={channels.length} />
      <ul className="flex flex-col gap-2 border-l-2 border-dashed pl-3">
        {channels.map((channel) => (
          <li key={channel.connection.id}>
            <ProductChannelCard
              channel={channel}
              suggestionCount={suggestionCounts.get(channel.connection.id) ?? 0}
              onOpen={onOpen}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
