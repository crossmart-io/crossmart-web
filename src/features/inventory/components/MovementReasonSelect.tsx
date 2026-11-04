import type { InventoryMovementReason } from '@/api/schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MANUAL_MOVEMENT_REASONS } from '../inventory.constants';
import { MOVEMENT_REASON_LABELS } from '../movement-reason';

interface MovementReasonSelectProps {
  id: string;
  value: InventoryMovementReason;
  onChange: (reason: InventoryMovementReason) => void;
}

function toManualReason(value: string): InventoryMovementReason | undefined {
  return MANUAL_MOVEMENT_REASONS.find((reason) => reason === value);
}

export function MovementReasonSelect({ id, value, onChange }: MovementReasonSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        const reason = toManualReason(next);
        if (reason) onChange(reason);
      }}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {MANUAL_MOVEMENT_REASONS.map((reason) => (
          <SelectItem key={reason} value={reason}>
            {MOVEMENT_REASON_LABELS[reason]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
