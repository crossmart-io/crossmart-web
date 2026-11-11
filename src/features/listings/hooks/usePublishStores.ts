import { useState } from 'react';
import { toast } from 'sonner';
import { ChannelConnectionStatus, WorkspacePermission } from '@/api/schema';
import { fetchClient } from '@/api/client';
import { unwrap } from '@/api/unwrap';
import { useChannelConnections } from '@/features/channels/hooks/useChannelConnections';
import { hasPermission, type Workspace } from '@/features/workspaces';
import { useInvalidateEndpoints } from '@/hooks/useInvalidateEndpoints';
import {
  CHANNEL_PRODUCTS_ENDPOINT,
  PRODUCT_CHANNEL_ENDPOINT,
  PRODUCT_CHANNELS_ENDPOINT,
  PUBLISH_STORES_COPY,
} from '../listings.constants';
import {
  PublishAvailability,
  type PublishResult,
  type PublishStore,
  publishResultOf,
  publishStoreOf,
} from '../publish-on-create';

const PUBLISHED_ENDPOINTS = [PRODUCT_CHANNELS_ENDPOINT, CHANNEL_PRODUCTS_ENDPOINT] as const;

/** The workspace's stores as a new product can go to them; none for roles that may not list. */
function usePublishStoreList(workspace: Workspace): PublishStore[] {
  const { data } = useChannelConnections(workspace.id);
  if (!hasPermission(workspace, WorkspacePermission.listings_edit)) return [];
  return (data ?? [])
    .filter((connection) => connection.status !== ChannelConnectionStatus.DISCONNECTED)
    .map(publishStoreOf);
}

/**
 * The stores a new product is published to, all ready ones ticked until the seller changes
 * that, and publishing to them once the product is saved: one request per store, together.
 */
export function usePublishStores(workspace: Workspace) {
  const stores = usePublishStoreList(workspace);
  const [chosen, setChosen] = useState<ReadonlySet<string> | null>(null);
  const refresh = useInvalidateEndpoints(PUBLISHED_ENDPOINTS);
  const ready = stores.filter((store) => store.availability === PublishAvailability.Ready);
  const selected = chosen ?? new Set(ready.map((store) => store.connection.id));
  const targets = ready.filter((store) => selected.has(store.connection.id));

  function toggle(connectionId: string): void {
    const next = new Set(selected);
    if (!next.delete(connectionId)) next.add(connectionId);
    setChosen(next);
  }

  async function publish(productId: string): Promise<PublishResult> {
    const answers = await Promise.allSettled(
      targets.map(({ connection }) =>
        unwrap(
          fetchClient.POST(PRODUCT_CHANNEL_ENDPOINT, {
            params: { path: { workspaceId: workspace.id, productId, connectionId: connection.id } },
          }),
        ),
      ),
    );
    await refresh();
    const result = publishResultOf(targets, answers);
    if (result.failures.length === 0 && result.added.length > 0) {
      toast.success(PUBLISH_STORES_COPY.published(result.added.length));
    }
    return result;
  }

  return { stores, selected, toggle, publish, publishes: targets.length > 0 };
}

export type PublishStoresState = ReturnType<typeof usePublishStores>;
