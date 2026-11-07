import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ASK_INSIGHTS_COPY } from '../ask-insights.constants';
import type { DayRangeFilter } from '../hooks/useDayRangeFilter';

interface DayFieldProps {
  label: string;
  value: string | undefined;
  onChange: (day: string) => void;
  min?: string;
  max?: string;
}

function DayField({ label, value, onChange, min, max }: DayFieldProps) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={id} className="text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type="date"
        className="w-40"
        value={value ?? ''}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

/** The first and last day of the period, both included; either can stay empty. */
export function DayRangeFields({ range, setFrom, setTo }: DayRangeFilter) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <DayField
        label={ASK_INSIGHTS_COPY.from}
        value={range.from}
        max={range.to}
        onChange={setFrom}
      />
      <DayField label={ASK_INSIGHTS_COPY.to} value={range.to} min={range.from} onChange={setTo} />
    </div>
  );
}
