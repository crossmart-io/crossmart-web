import type { ComponentProps } from 'react';
import { cn } from 'cn';
import { Input } from '@/components/ui/input';

/** The symbol shown before an amount, e.g. "$" for USD. */
function currencySymbol(currency: string): string {
  const parts = new Intl.NumberFormat(undefined, { style: 'currency', currency }).formatToParts(0);
  return parts.find((part) => part.type === 'currency')?.value ?? currency;
}

interface MoneyInputProps extends Omit<ComponentProps<typeof Input>, 'type'> {
  currency: string;
}

/** A decimal amount kept as text, so "19.90" stays exact. */
export function MoneyInput({ currency, className, ...props }: MoneyInputProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
        {currencySymbol(currency)}
      </span>
      <Input inputMode="decimal" autoComplete="off" className={cn('pl-8', className)} {...props} />
    </div>
  );
}
