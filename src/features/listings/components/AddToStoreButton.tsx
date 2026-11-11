import { Plus } from 'lucide-react';
import { useId } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toStoreRoute } from '@/config/routes';
import { needsReconnect } from '@/features/channels/connection-status';
import { type ProductChannelRef, useAddToStore } from '../hooks/useProductChannels';
import { CHANNEL_CARD_COPY, STORE_NOT_CONNECTED_COPY } from '../listings.constants';
import type { ProductChannel } from '../listings.types';

/** Why the store cannot take products now, with a link to the page where it is reconnected. */
function NotConnectedHint({ id, connectionId }: { id: string; connectionId: string }) {
  return (
    <p id={id} className="text-xs text-muted-foreground">
      {STORE_NOT_CONNECTED_COPY.reason}{' '}
      <Link to={toStoreRoute(connectionId)} className="font-medium text-foreground underline">
        {STORE_NOT_CONNECTED_COPY.action}
      </Link>
    </p>
  );
}

/** Adds the product in one click; blocked while the store needs reconnecting, and says why. */
export function AddToStoreButton({
  listingRef,
  channel,
}: {
  listingRef: ProductChannelRef;
  channel: ProductChannel;
}) {
  const add = useAddToStore(listingRef);
  const hintId = useId();
  const blocked = needsReconnect(channel.connection.status);
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="xs"
        disabled={add.isPending || blocked}
        aria-describedby={blocked ? hintId : undefined}
        onClick={() => add.mutate()}
      >
        {add.isPending ? <Spinner data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
        {CHANNEL_CARD_COPY.add}
      </Button>
      {blocked && <NotConnectedHint id={hintId} connectionId={channel.connection.id} />}
    </>
  );
}
