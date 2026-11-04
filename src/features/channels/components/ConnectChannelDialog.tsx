import { CircleAlert } from 'lucide-react';
import { type FormEvent, type ReactNode, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import type { ChannelInfo, ConnectableChannel } from '../channels.constants';
import { useStartChannelAuthorization } from '../hooks/useChannelConnections';
import { AccountField } from './AccountField';

const FORM_ID = 'connect-channel-form';

interface ConnectChannelDialogProps {
  workspaceId: string;
  channel: ChannelInfo;
  connect: ConnectableChannel;
  /** The button that opens the dialog. Omit it to open the dialog with `open` instead. */
  trigger?: ReactNode;
  /** Controls the dialog from outside, such as from a menu item. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Prefills the account, to connect it again. */
  initialAccount?: string;
}

function ConnectError({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

/** Asks which account to connect, then hands the merchant over to the channel to approve. */
export function ConnectChannelDialog({
  workspaceId,
  channel,
  connect,
  trigger,
  initialAccount = '',
  open: controlledOpen,
  onOpenChange,
}: ConnectChannelDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const [account, setAccount] = useState(initialAccount);
  const start = useStartChannelAuthorization(workspaceId);
  // After success the browser is leaving for the channel, so the form stays busy.
  const isBusy = start.isPending || start.isSuccess;

  function handleOpenChange(nextOpen: boolean) {
    if (isBusy) return;
    setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      setAccount(initialAccount);
      start.reset();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    start.mutate({ channel: connect.type, accountHandle: account.trim() });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect {channel.name}</DialogTitle>
          <DialogDescription>
            You will approve Crossmart on {channel.name}, then come back here.
          </DialogDescription>
        </DialogHeader>
        {start.error && <ConnectError message={start.error.message} />}
        <form id={FORM_ID} onSubmit={handleSubmit}>
          <AccountField
            prompt={connect.account}
            value={account}
            onChange={setAccount}
            disabled={isBusy}
          />
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isBusy}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isBusy || !account.trim()}>
            {isBusy && <Spinner data-icon="inline-start" />}
            Continue to {channel.name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
