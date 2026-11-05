import { ListingStatus } from '@/api/schema';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChannelLogoSize, channelInfoFor } from '@/features/channels/channels.constants';
import { ChannelLogo } from '@/features/channels/components/ChannelLogo';
import { cn } from '@/lib/utils';
import { LISTING_STATUS_LABELS, PRODUCT_STORE_ICONS_SHOWN } from '../listings.constants';
import type { ProductStore } from '../listings.types';

/** A dot on the icon for listings that are not simply live; live ones need no mark. */
const STATUS_DOTS: Partial<Record<ListingStatus, string>> = {
  [ListingStatus.ERROR]: 'bg-destructive',
  [ListingStatus.PENDING]: 'bg-muted-foreground',
  [ListingStatus.INACTIVE]: 'bg-muted-foreground',
};

function StoreIcon({ store }: { store: ProductStore }) {
  const channel = channelInfoFor(store.channel);
  const dot = STATUS_DOTS[store.status];
  const label = `${store.storeName} · ${LISTING_STATUS_LABELS[store.status]}`;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="relative inline-flex rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label={label}
        >
          {channel ? (
            <ChannelLogo logo={channel.logo} size={ChannelLogoSize.Small} />
          ) : (
            <span className="grid size-7 place-items-center rounded-md border text-xs">
              {store.storeName.slice(0, 1)}
            </span>
          )}
          {dot && (
            <span
              className={cn(
                'absolute -top-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-background',
                dot,
              )}
              aria-hidden="true"
            />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/** The channel icon of each store a product is in, with how many more when they do not fit. */
export function ProductStoreIcons({ stores }: { stores: readonly ProductStore[] }) {
  if (stores.length === 0) return <span className="text-muted-foreground">—</span>;
  const shown = stores.slice(0, PRODUCT_STORE_ICONS_SHOWN);
  const hidden = stores.length - shown.length;
  return (
    <span className="flex items-center gap-1.5">
      {shown.map((store) => (
        <StoreIcon key={store.connectionId} store={store} />
      ))}
      {hidden > 0 && <span className="text-xs text-muted-foreground tabular-nums">+{hidden}</span>}
    </span>
  );
}
