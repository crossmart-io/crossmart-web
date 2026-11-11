import { FormError } from '@/components/feedback/FormError';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { type ChannelConnection, connectionName } from '@/features/channels';
import { useStoreSetupSave } from '../hooks/useStoreSetupSave';
import { STORE_SETUP_COPY } from '../store-setup.constants';
import { AutoAddField } from './AutoAddField';
import { ChannelSetupStep } from './ChannelSetupStep';

export interface StoreSetupFormProps {
  workspaceId: string;
  connection: ChannelConnection;
  onDone: () => void;
}

/**
 * The one step after connecting a store: what the channel needs before it lists, and whether
 * every active product goes there. Saving does both; Skip leaves the store as it is.
 */
export function StoreSetupForm({ workspaceId, connection, onDone }: StoreSetupFormProps) {
  const setup = useStoreSetupSave(workspaceId, connection);
  const save = async () => {
    if (await setup.save()) onDone();
  };
  return (
    <Dialog open onOpenChange={(open) => !open && !setup.isSaving && onDone()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{STORE_SETUP_COPY.title(connectionName(connection))}</DialogTitle>
          <DialogDescription>{STORE_SETUP_COPY.description}</DialogDescription>
        </DialogHeader>
        <ChannelSetupStep
          workspaceId={workspaceId}
          connection={connection}
          stepRef={setup.stepRef}
        />
        <AutoAddField
          checked={setup.addActive}
          onChange={setup.setAddActive}
          disabled={setup.isSaving}
        />
        <FormError error={setup.selectionError} />
        <DialogFooter>
          <Button variant="outline" onClick={onDone} disabled={setup.isSaving}>
            {STORE_SETUP_COPY.skip}
          </Button>
          <Button onClick={() => void save()} disabled={setup.isSaving}>
            {setup.isSaving && <Spinner data-icon="inline-start" />}
            {setup.isSaving ? STORE_SETUP_COPY.saving : STORE_SETUP_COPY.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
