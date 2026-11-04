import type { SalesRange } from '@/api/schema';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SALES_RANGE_OPTIONS } from '../sales.constants';

function isSalesRange(value: string): value is SalesRange {
  return SALES_RANGE_OPTIONS.some((option) => option.value === value);
}

export function SalesRangePicker({
  value,
  onChange,
}: {
  value: SalesRange;
  onChange: (range: SalesRange) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={value}
      // A single toggle group reports '' when the active item is pressed again; keep it.
      onValueChange={(next) => isSalesRange(next) && onChange(next)}
      aria-label="Sales period"
    >
      {SALES_RANGE_OPTIONS.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.description}
          className="px-3"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
