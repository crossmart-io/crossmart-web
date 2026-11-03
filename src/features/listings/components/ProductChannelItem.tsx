import { ExternalLink, PencilLine } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { PriceSource } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toChannelConnectionRoute } from '@/config/routes';
import { formatMoney, pluralize } from '@/lib/format';
import { CHANNEL_CARD_VARIANT_LIMIT } from '../listings.constants';
import type { ChannelVariant, ProductChannel } from '../listings.types';
import { ChannelOverrideSheet, type OverrideProduct } from './ChannelOverrideSheet';
import { ListingStatusBadge } from './ListingStatusBadge';
import { PriceExplanation } from './PriceExplanation';

interface ProductChannelItemProps {
  workspaceId: string;
  product: OverrideProduct;
  channel: ProductChannel;
  canEdit: boolean;
}

function VariantPrice({
  variant,
  currency,
  showTitle,
}: {
  variant: ChannelVariant;
  currency: string;
  showTitle: boolean;
}) {
  return (
    <li className="flex flex-col gap-0.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate text-muted-foreground">
          {showTitle ? variant.title : 'Price'}
        </span>
        <span className="font-medium tabular-nums">
          {formatMoney(variant.price.price, currency)}
          {variant.price.source === PriceSource.override && (
            <span className="sr-only"> (set for this channel)</span>
          )}
        </span>
      </div>
      <PriceExplanation price={variant.price} />
      {variant.quantity !== null && (
        <span className="text-xs text-muted-foreground">
          Shows {pluralize(variant.quantity, 'unit')} in stock
        </span>
      )}
    </li>
  );
}

function ListingState({ channel }: { channel: ProductChannel }) {
  if (channel.listing) return <ListingStatusBadge status={channel.listing.status} />;
  return <Badge variant="outline">{channel.selected ? 'Not published yet' : 'Not selected'}</Badge>;
}

interface ChannelItemActionsProps {
  canEdit: boolean;
  externalUrl: string | null;
  onEdit: () => void;
}

function ChannelItemActions({ canEdit, externalUrl, onEdit }: ChannelItemActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {canEdit && (
        <Button type="button" variant="outline" size="sm" onClick={onEdit}>
          <PencilLine data-icon="inline-start" />
          Override for this channel
        </Button>
      )}
      {externalUrl && (
        <Button asChild variant="ghost" size="sm">
          <a href={externalUrl} target="_blank" rel="noreferrer">
            <ExternalLink data-icon="inline-start" />
            View
          </a>
        </Button>
      )}
    </div>
  );
}

/** The product on one channel: listing status, channel price with its explanation, shown stock. */
export function ProductChannelItem({
  workspaceId,
  product,
  channel,
  canEdit,
}: ProductChannelItemProps) {
  const [editing, setEditing] = useState(false);
  const { connection, listing, variants } = channel;
  const shown = variants.slice(0, CHANNEL_CARD_VARIANT_LIMIT);
  const hidden = variants.length - shown.length;
  return (
    <li className="flex flex-col gap-3 rounded-lg border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          to={toChannelConnectionRoute(connection.id)}
          className="truncate font-medium hover:underline"
        >
          {connection.displayName}
        </Link>
        <div className="flex items-center gap-1.5">
          {channel.override && <Badge variant="secondary">Overridden</Badge>}
          <ListingState channel={channel} />
        </div>
      </div>
      {listing?.lastError && <p className="text-sm text-destructive">{listing.lastError}</p>}
      <ul className="flex flex-col gap-3">
        {shown.map((variant) => (
          <VariantPrice
            key={variant.variantId}
            variant={variant}
            currency={connection.currencyCode}
            showTitle={variants.length > 1}
          />
        ))}
      </ul>
      {hidden > 0 && (
        <p className="text-xs text-muted-foreground">and {pluralize(hidden, 'more variant')}</p>
      )}
      <ChannelItemActions
        canEdit={canEdit}
        externalUrl={listing?.externalUrl ?? null}
        onEdit={() => setEditing(true)}
      />
      {editing && (
        <ChannelOverrideSheet
          workspaceId={workspaceId}
          product={product}
          channel={channel}
          open={editing}
          onOpenChange={setEditing}
        />
      )}
    </li>
  );
}
