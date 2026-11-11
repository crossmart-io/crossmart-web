import { useChannelConnections } from '@/features/channels';
import { useNow } from '@/hooks/useNow';
import { type StoreSetupRequest, storeToSetUp } from '../just-connected';
import { StoreSetupForm } from './StoreSetupForm';

interface StoreSetupDialogProps {
  workspaceId: string;
  /** The store the OAuth return said was connected. */
  request: StoreSetupRequest;
  onDone: () => void;
}

/** Offers the setup of the store just connected; nothing when it needs none. */
export function StoreSetupDialog({ workspaceId, request, onDone }: StoreSetupDialogProps) {
  const { data } = useChannelConnections(workspaceId);
  const now = useNow();
  const connection = data ? storeToSetUp(data, request, now) : undefined;
  if (!connection) return null;
  return <StoreSetupForm workspaceId={workspaceId} connection={connection} onDone={onDone} />;
}
