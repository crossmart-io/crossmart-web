import { cn } from 'cn';
import { formatDateTime } from '@/lib/format';
import type { InventoryMovement } from '../inventory.types';
import { MOVEMENT_REASON_LABELS } from '../movement-reason';
import { formatDelta } from '../stock-adjustment';

/** Who made the change: a person, an API key (an agent or a script), or Crossmart itself. */
function authorOf(movement: InventoryMovement): string {
  if (movement.apiKeyName) return `${movement.apiKeyName} (API key)`;
  return movement.userName ?? 'Crossmart';
}

export function MovementList({ movements }: { movements: InventoryMovement[] }) {
  return (
    <ol className="flex flex-col divide-y rounded-lg border">
      {movements.map((movement) => (
        <li key={movement.id} className="flex items-start justify-between gap-3 px-3 py-2.5">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-medium">{MOVEMENT_REASON_LABELS[movement.reason]}</span>
            {movement.note && <span className="break-words">{movement.note}</span>}
            <span className="text-xs text-muted-foreground">
              {formatDateTime(movement.createdAt)} · {authorOf(movement)}
            </span>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-0.5 tabular-nums">
            <span
              className={cn(
                'font-medium',
                movement.delta > 0 ? 'text-success' : 'text-destructive',
              )}
            >
              {formatDelta(movement.delta)}
            </span>
            <span className="text-xs text-muted-foreground">
              {movement.quantityAfter.toLocaleString()} on hand
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
