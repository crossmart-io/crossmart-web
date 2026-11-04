import { CircleAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/** Why a form's request failed, shown inside the form; nothing while there is no error. */
export function FormError({ error }: { error: Error | null }) {
  if (!error) return null;
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
