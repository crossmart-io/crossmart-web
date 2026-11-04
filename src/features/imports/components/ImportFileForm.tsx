import { CircleAlert, Download } from 'lucide-react';
import type { FormEvent } from 'react';
import { CatalogImportMode } from '@/api/schema';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  CSV_FILE_ACCEPT,
  FILE_IMPORT_MODE_COPY,
  type FileImportMode,
  INVENTORY_TEMPLATE_FILE_NAME,
  INVENTORY_TEMPLATE_HREF,
} from '../imports.constants';
import { ImportModePicker } from './ImportModePicker';

const FILE_INPUT_ID = 'catalog-import-file';

interface ImportFileFormProps {
  /** Lets a submit button outside the form (in the dialog footer) submit it. */
  formId: string;
  mode: FileImportMode;
  onModeChange: (mode: FileImportMode) => void;
  error: Error | null;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
}

export function ImportFileForm({
  formId,
  mode,
  onModeChange,
  error,
  onFileChange,
  onSubmit,
}: ImportFileFormProps) {
  const copy = FILE_IMPORT_MODE_COPY[mode];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <ImportModePicker value={mode} onChange={onModeChange} />
      <Field>
        <FieldLabel htmlFor={FILE_INPUT_ID}>{copy.fileLabel}</FieldLabel>
        <FieldDescription>{copy.instructions}</FieldDescription>
        <Input
          id={FILE_INPUT_ID}
          type="file"
          accept={CSV_FILE_ACCEPT}
          required
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
        <FieldDescription>Up to 5 MB and 10,000 rows.</FieldDescription>
      </Field>
      {mode === CatalogImportMode.inventory && <InventoryTemplateLink />}
    </form>
  );
}

function InventoryTemplateLink() {
  return (
    <Button variant="outline" size="sm" className="self-start" asChild>
      <a href={INVENTORY_TEMPLATE_HREF} download={INVENTORY_TEMPLATE_FILE_NAME}>
        <Download data-icon="inline-start" />
        Download template
      </a>
    </Button>
  );
}
