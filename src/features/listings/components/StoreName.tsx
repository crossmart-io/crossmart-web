import { ChannelLogoSize, channelInfoFor } from '@/features/channels/channels.constants';
import { ChannelLogo } from '@/features/channels/components/ChannelLogo';
import type { ProductChannel } from '../listings.types';

interface StoreNameProps {
  connection: ProductChannel['connection'];
}

/** A store's logo and name, the name cut short when it does not fit. */
export function StoreName({ connection }: StoreNameProps) {
  const info = channelInfoFor(connection.channel);
  return (
    <span className="flex min-w-0 items-center gap-2">
      {info && <ChannelLogo logo={info.logo} size={ChannelLogoSize.Small} />}
      <span className="truncate font-medium" title={connection.displayName}>
        {connection.displayName}
      </span>
    </span>
  );
}
