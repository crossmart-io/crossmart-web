import { CircleX } from 'lucide-react';
import { ListingDisplayState } from '@/api/schema';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ChannelLogoSize, channelInfoFor } from '@/features/channels/channels.constants';
import { ChannelLogo } from '@/features/channels/components/ChannelLogo';
import { cn } from '@/lib/utils';
import { LISTING_STATE_PRESENTATION, LISTING_STATUS_STATES } from '../listing-states';
import { PRODUCT_STORE_ICONS_SHOWN, PRODUCT_STORE_FAILED_LABEL } from '../listings.constants';
import type { ProductStore } from '../listings.types';

/** A dot on the icon for listings that are not simply published; published ones need no mark. */
const STATE_DOTS: Partial<Record<ListingDisplayState, string>> = {
  [ListingDisplayState.failed]: 'bg-destructive',
  [ListingDisplayState.publishing]: 'bg-muted-foreground',
  [ListingDisplayState.removed]: 'bg-muted-foreground',
};

function StoreIcon({ store }: { store: ProductStore }) {
  const channel = channelInfoFor(store.channel);
  const state = LISTING_STATUS_STATES[store.status];
  const dot = STATE_DOTS[state];
  const label = `${store.storeName} · ${LISTING_STATE_PRESENTATION[state].label}`;
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

/** Says in words that publishing failed somewhere, so it never rests on a red dot alone. */
function FailedCue({ stores }: { stores: readonly ProductStore[] }) {
  const failed = stores.filter(
    (store) => LISTING_STATUS_STATES[store.status] === ListingDisplayState.failed,
  ).length;
  if (failed === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap text-destructive">
      <CircleX className="size-3.5" aria-hidden="true" />
      {PRODUCT_STORE_FAILED_LABEL(failed)}
    </span>
  );
}

/**
 * The channel icon of each store a product is in, with how many more when they do not fit, and
 * how many stores refused it.
 */
export function ProductStoreIcons({ stores }: { stores: readonly ProductStore[] }) {
  if (stores.length === 0) return <span className="text-muted-foreground">—</span>;
  const shown = stores.slice(0, PRODUCT_STORE_ICONS_SHOWN);
  const hidden = stores.length - shown.length;
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      {shown.map((store) => (
        <StoreIcon key={store.connectionId} store={store} />
      ))}
      {hidden > 0 && <span className="text-xs text-muted-foreground tabular-nums">+{hidden}</span>}
      <FailedCue stores={stores} />
    </span>
  );
}
