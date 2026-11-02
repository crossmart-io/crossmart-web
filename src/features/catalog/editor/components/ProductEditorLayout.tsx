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
}

/** Content on the left, status and organization on the right. */
export function ProductEditorLayout({
  workspaceId,
  currency,
  hasOptions,
}: ProductEditorLayoutProps) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-6">
        <TitleDescriptionCard />
        <MediaCard workspaceId={workspaceId} />
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
        <StatusCard />
        <ChannelsCard />
        <OrganizationCard />
      </div>
    </div>
  );
}
