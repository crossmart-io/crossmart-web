import { Minus, Plus } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

interface QuantityStepperProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** The lowest value the buttons step down to; typing can still go lower. */
  min?: number;
  describedBy?: string;
  invalid?: boolean;
}

function step(value: string, by: number, min: number | undefined): string {
  const current = Number.parseInt(value, 10);
  const next = (Number.isNaN(current) ? 0 : current) + by;
  return String(min === undefined ? next : Math.max(min, next));
}

/** A whole-number field with − and + buttons, sized for thumbs on a phone. */
export function QuantityStepper({
  id,
  value,
  onChange,
  min,
  describedBy,
  invalid = false,
}: QuantityStepperProps) {
  return (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupButton
          size="icon-sm"
          aria-label="One less"
          onClick={() => onChange(step(value, -1, min))}
        >
          <Minus />
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className="text-center tabular-nums"
        autoComplete="off"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-sm"
          aria-label="One more"
          onClick={() => onChange(step(value, 1, min))}
        >
          <Plus />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
