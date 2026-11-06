import { Share2 } from 'lucide-react';
import { Link } from 'react-router';
import { ChannelConnectionStatus } from '@/api/schema';
import { ROUTES } from '@/config/routes';
// Imported from its file, not the feature's index, which itself uses the catalog.
import { useChannelConnections } from '@/features/channels/hooks/useChannelConnections';
import { NEW_PRODUCT_CHANNELS_COPY } from '../../catalog.constants';
import { EditorCard } from './EditorCard';

/** Whether the workspace has a store to list in, connected or waiting to be reconnected. */
function useHasStores(workspaceId: string): boolean {
  const { data } = useChannelConnections(workspaceId);
  return (data ?? []).some(
    (connection) => connection.status !== ChannelConnectionStatus.DISCONNECTED,
  );
}

/**
 * The channels card of a product not saved yet. Stores are chosen on the saved product's page,
 * so this says how to get there, or sends the seller to connect a first store.
 */
export function ChannelsCard({ workspaceId }: { workspaceId: string }) {
  const hasStores = useHasStores(workspaceId);
  return (
    <EditorCard title="Channels">
      <div className="flex items-start gap-3 text-sm">
        <Share2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        {hasStores ? (
          <p className="text-muted-foreground">{NEW_PRODUCT_CHANNELS_COPY.saveFirst}</p>
        ) : (
          <p className="text-muted-foreground">
            {NEW_PRODUCT_CHANNELS_COPY.noStores}{' '}
            <Link to={ROUTES.channels} className="font-medium text-foreground underline">
              {NEW_PRODUCT_CHANNELS_COPY.connect}
            </Link>{' '}
            {NEW_PRODUCT_CHANNELS_COPY.connectReason}
          </p>
        )}
      </div>
    </EditorCard>
  );
}
