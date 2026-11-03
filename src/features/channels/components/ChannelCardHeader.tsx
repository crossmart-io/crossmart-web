import type { ReactNode } from 'react';
import type { ChannelInfo } from '../channels.constants';
import { ChannelLogo } from './ChannelLogo';

interface ChannelCardHeaderProps {
  channel: ChannelInfo;
  /** The status shown next to the logo. */
  badge: ReactNode;
}

/** The logo, status, name and description every channel card starts with. */
export function ChannelCardHeader({ channel, badge }: ChannelCardHeaderProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <ChannelLogo logo={channel.logo} />
        {badge}
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-medium">{channel.name}</h2>
        <p className="text-sm text-muted-foreground">{channel.description}</p>
      </div>
    </>
  );
}
