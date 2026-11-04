import { Upload } from 'lucide-react';
import { useState } from 'react';
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
import { useImportProducts } from '../hooks/useImportProducts';
import { DEFAULT_IMPORT_MODE, type FileImportMode } from '../imports.constants';
import { ImportFileForm } from './ImportFileForm';
import { ImportResultSummary } from './ImportResultSummary';

const IMPORT_FORM_ID = 'catalog-import-form';

export function ImportProductsDialog({ workspaceId }: { workspaceId: string | undefined }) {
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
          {result ? (
            <Button onClick={() => handleOpenChange(false)}>Done</Button>
          ) : (
            <Button
              type="submit"
              form={IMPORT_FORM_ID}
              disabled={!file || importProducts.isPending}
            >
              {importProducts.isPending ? 'Importing…' : 'Import'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
