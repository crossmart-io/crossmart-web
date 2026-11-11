import type { ChannelType } from '@/api/schema';
import { useChannelConnections } from '@/features/channels';
import { useNow } from '@/hooks/useNow';
import { justConnectedStore } from '../just-connected';
import { StoreSetupForm } from './StoreSetupForm';

interface StoreSetupDialogProps {
  workspaceId: string;
  /** The channel the OAuth return said was connected. */
  channel: ChannelType;
  onDone: () => void;
}

/** Offers the setup of the store just connected on `channel`; nothing when it needs none. */
export function StoreSetupDialog({ workspaceId, channel, onDone }: StoreSetupDialogProps) {
  const { data } = useChannelConnections(workspaceId);
  const now = useNow();
  const connection = data ? justConnectedStore(data, channel, now) : undefined;
  if (!connection) return null;
  return <StoreSetupForm workspaceId={workspaceId} connection={connection} onDone={onDone} />;
}
