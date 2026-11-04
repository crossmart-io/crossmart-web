import { type ComponentProps, useId } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';

/** The symbol shown before an amount, e.g. "$" for USD. */
function currencySymbol(currency: string): string {
  const parts = new Intl.NumberFormat(undefined, { style: 'currency', currency }).formatToParts(0);
  return parts.find((part) => part.type === 'currency')?.value ?? currency;
}

interface MoneyInputProps extends Omit<ComponentProps<typeof InputGroupInput>, 'type'> {
  currency: string;
}

/**
 * A decimal amount kept as text, so "19.90" stays exact. The currency sits in an addon that
 * fits any symbol ("$", "CHF", "zł") and is read out with the field.
 */
export function MoneyInput({
  currency,
  'aria-describedby': describedBy,
  ...props
}: MoneyInputProps) {
  const currencyId = useId();

  return (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText id={currencyId}>
          <span aria-hidden="true">{currencySymbol(currency)}</span>
          <span className="sr-only">Amount in {currency}</span>
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        inputMode="decimal"
        autoComplete="off"
        aria-describedby={[describedBy, currencyId].filter(Boolean).join(' ')}
        className="tabular-nums"
        {...props}
      />
    </InputGroup>
  );
}
