import { type MouseEvent, type ReactNode, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { ConfirmTone } from './confirm-tone';

interface ConfirmDialogProps {
  /** The button that opens the dialog. Omit it to open the dialog with `open`. */
  trigger?: ReactNode;
  /** Opens the dialog from elsewhere, such as a menu item; pair it with `onOpenChange`. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: ConfirmTone;
  /** Resolves when the action is done. A rejection keeps the dialog open so the user can retry. */
  onConfirm: () => Promise<unknown>;
}

/** The dialog's open state: its own, or the caller's when it passes `open`. */
function useOpenState({ open, onOpenChange }: Pick<ConfirmDialogProps, 'open' | 'onOpenChange'>) {
  const [ownOpen, setOwnOpen] = useState(false);
  const setOpen = (next: boolean) => {
    setOwnOpen(next);
    onOpenChange?.(next);
  };
  return [open ?? ownOpen, setOpen] as const;
}

/** Confirms an action and stays open, busy, until the action finishes. */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  tone = ConfirmTone.Destructive,
  onConfirm,
  ...openState
}: ConfirmDialogProps) {
  const [open, setOpen] = useOpenState(openState);
  const [isPending, setIsPending] = useState(false);

  async function confirm(event: MouseEvent<HTMLButtonElement>) {
    // The action button would close the dialog before the request finishes.
    event.preventDefault();
    setIsPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch {
      // The query client shows the error as a toast; the dialog stays open for a retry.
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={tone}
            onClick={(event) => void confirm(event)}
            disabled={isPending}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
