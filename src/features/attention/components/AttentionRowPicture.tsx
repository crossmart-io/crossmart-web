import { Sparkles } from 'lucide-react';
import { ProductThumbnail } from '@/features/catalog/components/ProductThumbnail';
import { ChannelLogo } from '@/features/channels/components/ChannelLogo';
import { ChannelLogoSize, channelInfoFor } from '@/features/channels/channels.constants';
import { AttentionKind, type AttentionRow } from '../attention.types';

/** The product's photo, the store's logo, or the agent's mark for reviews. */
export function AttentionRowPicture({ row }: { row: AttentionRow }) {
  if (row.kind === AttentionKind.Listing) {
    return <ProductThumbnail url={row.imageUrl ?? null} alt="" className="size-9" />;
  }
  const logo = row.channel ? channelInfoFor(row.channel)?.logo : undefined;
  if (logo) return <ChannelLogo logo={logo} size={ChannelLogoSize.Small} />;
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-md border bg-background">
      <Sparkles className="size-4 text-brand" aria-hidden="true" />
    </span>
  );
}
