import { CircleAlert } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormErrorProps {
  error: Error | null;
  className?: string;
}

/** Why a form's request failed, shown inside the form; nothing while there is no error. */
export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null;
  return (
    <Alert variant="destructive" className={className}>
      <CircleAlert />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
