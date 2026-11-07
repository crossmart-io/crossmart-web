import { BillingInterval } from '@/api/schema';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { isEnumValue } from '@/lib/enum';
import { INTERVAL_LABELS } from '../billing.constants';

interface IntervalToggleProps {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
  /** A short note next to the annual option, such as how much it saves. */
  annualNote?: string;
}

/** Monthly or annual prices. */
export function IntervalToggle({ value, onChange, annualNote }: IntervalToggleProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={value}
      // A single toggle group reports '' when the active item is pressed again; keep it.
      onValueChange={(next) => isEnumValue(BillingInterval, next) && onChange(next)}
      aria-label="Billing interval"
    >
      {Object.values(BillingInterval).map((interval) => (
        <ToggleGroupItem key={interval} value={interval} className="px-3">
          {INTERVAL_LABELS[interval]}
          {interval === BillingInterval.ANNUAL && annualNote && (
            <span className="text-xs text-success">{annualNote}</span>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
