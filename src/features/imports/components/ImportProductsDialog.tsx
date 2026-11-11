import { Upload } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
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
import { ROUTES } from '@/config/routes';
import { useImportProducts } from '../hooks/useImportProducts';
import { DEFAULT_IMPORT_MODE, type FileImportMode } from '../imports.constants';
import { ImportFileForm } from './ImportFileForm';
import { ImportResultSummary } from './ImportResultSummary';

const IMPORT_FORM_ID = 'catalog-import-form';
const HISTORY_LABEL = 'Import history';

function HistoryLink() {
  return (
    <Button variant="link" className="px-0 sm:mr-auto" asChild>
      <Link to={ROUTES.imports}>{HISTORY_LABEL}</Link>
    </Button>
  );
}

function ImportSubmitButton({ disabled, isPending }: { disabled: boolean; isPending: boolean }) {
  return (
    <Button type="submit" form={IMPORT_FORM_ID} disabled={disabled || isPending}>
      {isPending ? 'Importing…' : 'Import'}
    </Button>
  );
}

interface ImportProductsDialogProps {
  workspaceId: string;
  /** Links to past imports from the dialog; off on the imports page itself. */
  showHistoryLink?: boolean;
}

/** Imports a CSV file into the catalog, with a link to every import made before. */
export function ImportProductsDialog({
  workspaceId,
  showHistoryLink = true,
}: ImportProductsDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<FileImportMode>(DEFAULT_IMPORT_MODE);
  const [file, setFile] = useState<File | null>(null);
  const importProducts = useImportProducts(workspaceId);
  const result = importProducts.data;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setFile(null);
      setMode(DEFAULT_IMPORT_MODE);
      importProducts.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{result ? 'Import finished' : 'Import from a CSV file'}</DialogTitle>
          <DialogDescription>
            {result
              ? 'Here is what changed in your catalog.'
              : 'Add products, update the ones you have, or set stock levels.'}
          </DialogDescription>
        </DialogHeader>
        {result ? (
          <ImportResultSummary result={result} />
        ) : (
          <ImportFileForm
            formId={IMPORT_FORM_ID}
            mode={mode}
            onModeChange={setMode}
            error={importProducts.error}
            onFileChange={setFile}
            onSubmit={() => file && importProducts.mutate({ mode, file })}
          />
        )}
        <DialogFooter>
          {showHistoryLink && <HistoryLink />}
          {result ? (
            <Button onClick={() => handleOpenChange(false)}>Done</Button>
          ) : (
            <ImportSubmitButton disabled={!file} isPending={importProducts.isPending} />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
