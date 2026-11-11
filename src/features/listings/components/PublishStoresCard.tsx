import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ROUTES, toStoreRoute } from '@/config/routes';
import { ChannelLogo } from '@/features/channels/components/ChannelLogo';
import { ChannelLogoSize, channelInfoFor } from '@/features/channels/channels.constants';
import { connectionName } from '@/features/channels/connection-name';
import type { PublishStoresState } from '../hooks/usePublishStores';
import { PUBLISH_STORES_COPY } from '../listings.constants';
import { PublishAvailability, type PublishStore } from '../publish-on-create';

/** Why a store cannot be ticked, beside its name. */
function AvailabilityNote({ store }: { store: PublishStore }) {
  if (store.availability === PublishAvailability.Automatic) {
    return <span className="text-xs text-muted-foreground">{PUBLISH_STORES_COPY.automatic}</span>;
  }
  if (store.availability === PublishAvailability.NeedsReconnect) {
    return (
      <Link to={toStoreRoute(store.connection.id)} className="text-xs font-medium underline">
        {PUBLISH_STORES_COPY.reconnect}
      </Link>
    );
  }
  return null;
}

function PublishStoreRow({ store, state }: { store: PublishStore; state: PublishStoresState }) {
  const { connection, availability } = store;
  const id = `publish-${connection.id}`;
  const logo = channelInfoFor(connection.channel)?.logo;
  const automatic = availability === PublishAvailability.Automatic;
  return (
    <li className="flex items-center gap-3 py-2">
      <Checkbox
        id={id}
        checked={automatic || state.selected.has(connection.id)}
        disabled={availability !== PublishAvailability.Ready}
        onCheckedChange={() => state.toggle(connection.id)}
      />
      {logo && <ChannelLogo logo={logo} size={ChannelLogoSize.Small} />}
      <div className="flex min-w-0 flex-col">
        <Label htmlFor={id} className="truncate font-normal">
          {connectionName(connection)}
        </Label>
        <AvailabilityNote store={store} />
      </div>
    </li>
  );
}

function NoStores() {
  return (
    <p className="text-sm text-muted-foreground">
      {PUBLISH_STORES_COPY.noStores}{' '}
      <Link to={ROUTES.stores} className="font-medium text-foreground underline">
        {PUBLISH_STORES_COPY.connect}
      </Link>
    </p>
  );
}

/** The stores a new product goes to with "Save & publish", all ready ones ticked. */
export function PublishStoresCard({ state }: { state: PublishStoresState }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-sm font-semibold">{PUBLISH_STORES_COPY.title}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {state.stores.length === 0 ? (
          <NoStores />
        ) : (
          <ul className="flex flex-col divide-y">
            {state.stores.map((store) => (
              <PublishStoreRow key={store.connection.id} store={store} state={state} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
