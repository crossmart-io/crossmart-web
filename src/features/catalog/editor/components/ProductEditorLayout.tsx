import type { ReactNode } from 'react';
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
  /** The saved product; AI writing needs one. Absent while creating. */
  productId?: string;
  currency: string;
  /** With options, price and stock are edited per variant instead of in their own cards. */
  hasOptions: boolean;
  onPendingUploadsChange: (count: number) => void;
  /** Extra cards for the side column, such as the product's recent activity. */
  aside?: ReactNode;
  /** Where the product is listed; a placeholder card until the product exists. */
  channels?: ReactNode;
}

/** Content on the left, status and organization on the right. */
export function ProductEditorLayout({
  workspaceId,
  productId,
  currency,
  hasOptions,
  onPendingUploadsChange,
  aside,
  channels,
}: ProductEditorLayoutProps) {
  // On one column, status comes first: it is what sellers check before anything else.
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);

  return (
    // minmax(0, 1fr) on one column too: otherwise the widest card sets the page width on phones.
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex min-w-0 flex-col gap-6">
        {!isDesktop && <StatusCard />}
        <TitleDescriptionCard aiTarget={productId ? { workspaceId, productId } : undefined} />
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
      <div className="flex min-w-0 flex-col gap-6">
        {isDesktop && <StatusCard />}
        {channels ?? <ChannelsCard />}
        <OrganizationCard />
        {aside}
      </div>
    </div>
  );
}
