import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { parseEnum } from '@/lib/enum';
import { AGENT_CONSOLE_COPY, EVENT_FILTERS, EventFilter } from '../agent-console.constants';

interface EventFilterBarProps {
  value: EventFilter;
  onChange: (filter: EventFilter) => void;
}

/** All, Agent, Stores, Orders or Errors. */
export function EventFilterBar({ value, onChange }: EventFilterBarProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      spacing={0}
      value={value}
      onValueChange={(next) => {
        const filter = parseEnum(EventFilter, next);
        if (filter) onChange(filter);
      }}
      aria-label={AGENT_CONSOLE_COPY.filterLabel}
      className="w-full"
    >
      {EVENT_FILTERS.map(({ value: filter, label }) => (
        <ToggleGroupItem key={filter} value={filter} className="flex-1 px-1.5 text-xs">
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
