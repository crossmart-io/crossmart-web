import { CircleAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface CardSaveFooterProps {
  label: string;
  error: Error | null;
  isSaving: boolean;
  disabled: boolean;
  /** Without it, the button submits the card's form. */
  onSave?: () => void;
}

/** A settings card's save button, with the reason the last save failed. */
export function CardSaveFooter({ label, error, isSaving, disabled, onSave }: CardSaveFooterProps) {
  return (
    <CardFooter className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
      {error && (
        <Alert variant="destructive" className="sm:mr-auto sm:w-auto">
          <CircleAlert />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <Button type={onSave ? 'button' : 'submit'} disabled={disabled || isSaving} onClick={onSave}>
        {isSaving && <Spinner data-icon="inline-start" />}
        {label}
      </Button>
    </CardFooter>
  );
}
