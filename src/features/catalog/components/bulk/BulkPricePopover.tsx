import { Percent } from 'lucide-react';
import { type FormEvent, useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FieldDescription } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  MAX_PRICE_ADJUSTMENT_PERCENT,
  MIN_PRICE_ADJUSTMENT_PERCENT,
} from '../../catalog.constants';

interface BulkPricePopoverProps {
  disabled: boolean;
  onApply: (percent: number) => void;
}

function parsePercent(text: string): number | null {
  const percent = Number(text.trim());
  const inRange =
    percent >= MIN_PRICE_ADJUSTMENT_PERCENT && percent <= MAX_PRICE_ADJUSTMENT_PERCENT;
  return text.trim() !== '' && Number.isFinite(percent) && percent !== 0 && inRange
    ? percent
    : null;
}

/** Moves every variant price of the selection by a percentage. */
export function BulkPricePopover({ disabled, onApply }: BulkPricePopoverProps) {
  const inputId = useId();
  const hintId = useId();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const percent = parsePercent(text);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (percent === null) return;
    onApply(percent);
    setText('');
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Percent data-icon="inline-start" />
          Price
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Label htmlFor={inputId}>Change prices by</Label>
          <InputGroup>
            <InputGroupInput
              id={inputId}
              inputMode="decimal"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="10 or -15"
              aria-describedby={hintId}
              className="tabular-nums"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>%</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription id={hintId}>
            Every variant, including compare-at prices. Rounded to the cent.
          </FieldDescription>
          <Button type="submit" size="sm" className="self-end" disabled={percent === null}>
            Apply
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
