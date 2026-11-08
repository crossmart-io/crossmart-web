import type { AccountMapInput } from '../account-map-graph';
import { CATALOG_NODE_ID, comingSoonChannels } from '../account-map-graph';
import { mapStatusCounts } from '../map-status';
import { CatalogHubCard } from './CatalogHubNode';
import { GhostChannelCard } from './GhostChannelNode';
import { StoreCard } from './StoreCard';

/**
 * The account's map as a list: the catalog, then each store and each channel coming soon as
 * the same cards the graph draws. Shown on narrow screens, and to anyone who prefers it.
 */
export function AccountChannelList({ stores, productCount, channels, overlay }: AccountMapInput) {
  return (
    <div className="flex flex-col gap-3">
      <CatalogHubCard productCount={productCount} overlay={overlay?.nodes[CATALOG_NODE_ID]} />
      <ul className="flex flex-col gap-3 border-l-2 border-dashed pt-1 pl-3">
        {stores.map((store) => (
          <li key={store.connectionId}>
            <StoreCard
              store={store}
              counts={mapStatusCounts(store.states)}
              overlay={overlay?.nodes[store.connectionId]}
            />
          </li>
        ))}
        {comingSoonChannels(channels).map((channel) => (
          <li key={channel.name}>
            <GhostChannelCard name={channel.name} logo={channel.logo} />
          </li>
        ))}
      </ul>
    </div>
  );
}
