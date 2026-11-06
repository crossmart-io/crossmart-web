import { TableHead } from '@/components/ui/table';

/** Names the column of row buttons for screen readers, which skip an empty header. */
export const ACTIONS_COLUMN_LABEL = 'Actions';

/** The header of a table's action column: visually empty, but labelled. */
export function ActionsTableHead({ className }: { className?: string }) {
  return (
    <TableHead className={className}>
      <span className="sr-only">{ACTIONS_COLUMN_LABEL}</span>
    </TableHead>
  );
}
