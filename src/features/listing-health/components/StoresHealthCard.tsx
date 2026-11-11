import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';
import { LISTING_HEALTH_COPY } from '../listing-health.constants';
import type { StoreListingHealth } from '../listing-health.types';
import { StoreHealthRow } from './StoreHealthRow';

/** Each store with its products by state, so a store that needs attention stands out. */
export function StoresHealthCard({ stores }: { stores: StoreListingHealth[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{LISTING_HEALTH_COPY.storesTitle}</CardTitle>
        <CardDescription>{LISTING_HEALTH_COPY.storesDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {stores.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            <Link to={ROUTES.stores} className="font-medium text-foreground underline">
              {LISTING_HEALTH_COPY.connectStore}
            </Link>{' '}
            {LISTING_HEALTH_COPY.noStores}
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {stores.map((store) => (
              <StoreHealthRow key={store.connectionId} store={store} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
