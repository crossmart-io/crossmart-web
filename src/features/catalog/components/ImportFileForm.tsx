import { CircleAlert } from 'lucide-react';
import type { FormEvent } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { CSV_FILE_ACCEPT } from '../catalog.constants';

const FILE_INPUT_ID = 'catalog-import-file';

interface ImportFileFormProps {
  /** Lets a submit button outside the form (in the dialog footer) submit it. */
  formId: string;
  error: Error | null;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
}

export function ImportFileForm({ formId, error, onFileChange, onSubmit }: ImportFileFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <Field>
        <FieldLabel htmlFor={FILE_INPUT_ID}>Product CSV</FieldLabel>
        <Input
          id={FILE_INPUT_ID}
          type="file"
          accept={CSV_FILE_ACCEPT}
          required
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
        <FieldDescription>Up to 5 MB and 10,000 rows.</FieldDescription>
      </Field>
    </form>
  );
}
