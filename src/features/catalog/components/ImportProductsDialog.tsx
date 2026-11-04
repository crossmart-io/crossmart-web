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
import { ImportFileForm } from './ImportFileForm';
import { ImportResultSummary } from './ImportResultSummary';

const IMPORT_FORM_ID = 'catalog-import-form';

export function ImportProductsDialog({ workspaceId }: { workspaceId: string | undefined }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const importProducts = useImportProducts(workspaceId);
  const result = importProducts.data;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setFile(null);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import from Shopify</DialogTitle>
          <DialogDescription>
            In Shopify, go to Products → Export and choose CSV. Products already in your catalog are
            left unchanged.
          </DialogDescription>
        </DialogHeader>
        {result ? (
          <ImportResultSummary result={result} />
        ) : (
          <ImportFileForm
            formId={IMPORT_FORM_ID}
            error={importProducts.error}
            onFileChange={setFile}
            onSubmit={() => file && importProducts.mutate(file)}
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
