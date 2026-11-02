import { DESKTOP_MEDIA_QUERY, useMediaQuery } from '@/hooks/useMediaQuery';
import { ChannelsCard } from './ChannelsCard';
import { InventoryCard } from './InventoryCard';
import { MediaCard } from './MediaCard';
import { OrganizationCard } from './OrganizationCard';
import { PricingCard } from './PricingCard';
import { ShippingCard } from './ShippingCard';
import { StatusCard } from './StatusCard';
import { TitleDescriptionCard } from './TitleDescriptionCard';
import { VariantsCard } from './VariantsCard';

interface ProductEditorLayoutProps {
  workspaceId: string;
  currency: string;
  /** With options, price and stock are edited per variant instead of in their own cards. */
  hasOptions: boolean;
  onPendingUploadsChange: (count: number) => void;
}

/** Content on the left, status and organization on the right. */
export function ProductEditorLayout({
  workspaceId,
  currency,
  hasOptions,
  onPendingUploadsChange,
}: ProductEditorLayoutProps) {
  // On one column, status comes first: it is what sellers check before anything else.
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-6">
        {!isDesktop && <StatusCard />}
        <TitleDescriptionCard />
        <MediaCard workspaceId={workspaceId} onPendingChange={onPendingUploadsChange} />
        {!hasOptions && (
          <>
            <PricingCard currency={currency} />
            <InventoryCard />
            <ShippingCard />
          </>
        )}
        <VariantsCard currency={currency} />
      </div>
      <div className="flex flex-col gap-6">
        {isDesktop && <StatusCard />}
        <ChannelsCard />
        <OrganizationCard />
      </div>
    </div>
  );
}
