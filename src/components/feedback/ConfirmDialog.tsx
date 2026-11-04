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

interface ConfirmDialogProps {
  /** The button that opens the dialog. */
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  /** Resolves when the action is done. A rejection keeps the dialog open so the user can retry. */
  onConfirm: () => Promise<unknown>;
}

/** Confirms a destructive action and stays open, busy, until the action finishes. */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
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
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
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
