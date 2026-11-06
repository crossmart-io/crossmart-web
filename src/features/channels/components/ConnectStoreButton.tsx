import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CONNECT_STORE_LABEL,
  type ChannelInfo,
  type ConnectableChannel,
} from '../channels.constants';
import { ConnectChannelDialog } from './ConnectChannelDialog';

interface ConnectStoreButtonProps {
  workspaceId: string;
  channel: ChannelInfo;
  connect: ConnectableChannel;
  /** Outline next to a primary action; ghost in a card footer. */
  variant?: 'outline' | 'ghost';
}

/** Connects one more store of the channel, such as a second Shopify shop. */
export function ConnectStoreButton({
  workspaceId,
  channel,
  connect,
  variant = 'outline',
}: ConnectStoreButtonProps) {
  return (
    <ConnectChannelDialog
      workspaceId={workspaceId}
      channel={channel}
      connect={connect}
      trigger={
        <Button variant={variant} size="sm">
          <Plus data-icon="inline-start" />
          {CONNECT_STORE_LABEL}
        </Button>
      }
    />
  );
}
