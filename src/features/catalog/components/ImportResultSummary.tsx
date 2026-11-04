import { CircleAlert, CircleCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { pluralize } from '@/lib/format';
import type { CatalogImportResult, ImportIssue } from '../catalog.types';

export function ImportResultSummary({ result }: { result: CatalogImportResult }) {
  const { createdProducts, createdVariants, skipped, failed } = result;

  return (
    <div className="flex flex-col gap-3">
      <Alert>
        <CircleCheck />
        <AlertTitle>
          Imported {pluralize(createdProducts, 'product')} with{' '}
          {pluralize(createdVariants, 'variant')}
        </AlertTitle>
        {skipped.length > 0 && (
          <AlertDescription>
            {pluralize(skipped.length, 'product was', 'products were')} already in your catalog and
            left unchanged.
          </AlertDescription>
        )}
      </Alert>
      {failed.length > 0 && <FailedProducts issues={failed} />}
    </div>
  );
}

function FailedProducts({ issues }: { issues: ImportIssue[] }) {
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertTitle>{pluralize(issues.length, 'product')} could not be imported</AlertTitle>
      <AlertDescription>
        <ul className="mt-1 flex max-h-48 flex-col gap-1 overflow-y-auto">
          {issues.map((issue) => (
            <li key={`${issue.handle}-${issue.row}-${issue.code}`}>
              {issue.row !== undefined && <span className="font-medium">Row {issue.row}: </span>}
              {issue.handle && <span className="font-mono text-xs">{issue.handle} </span>}
              {issue.message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
