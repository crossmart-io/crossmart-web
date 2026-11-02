import { ImportJobStatus } from '@/api/schema';
import { Badge } from '@/components/ui/badge';
import { IMPORT_JOB_STATUS_LABELS } from '../imports.constants';

type StatusBadgeVariant = 'success' | 'destructive' | 'outline';

const BADGE_VARIANTS = {
  [ImportJobStatus.COMPLETED]: 'success',
  [ImportJobStatus.FAILED]: 'destructive',
  [ImportJobStatus.PROCESSING]: 'outline',
} as const satisfies Record<ImportJobStatus, StatusBadgeVariant>;

export function ImportJobStatusBadge({ status }: { status: ImportJobStatus }) {
  return (
    <Badge variant={BADGE_VARIANTS[status]}>
      <span data-dot className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {IMPORT_JOB_STATUS_LABELS[status]}
    </Badge>
  );
}
