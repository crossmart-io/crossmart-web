import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { EnumSelectField } from '@/components/forms/EnumSelectField';
import { MoneyInput } from '@/components/forms/MoneyInput';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { findOptionValue } from '@/lib/enum';
import {
  COMPARE_AT_OPTIONS,
  RATE_MODE_OPTIONS,
  RateMode,
  ROUNDING_OPTIONS,
} from '../listings.constants';
import type { PricingRuleFormValues } from '../pricing-rule-form';

function PercentInput({
  name,
  label,
}: {
  name: 'adjustmentPercent' | 'minMarginPercent';
  label: string;
}) {
  const { register, getFieldState, formState } = useFormContext<PricingRuleFormValues>();
  const { error } = getFieldState(name, formState);
  return (
    <>
      <InputGroup>
        <InputGroupInput
          id={name}
          inputMode="decimal"
          aria-label={label}
          aria-invalid={Boolean(error)}
          className="tabular-nums"
          {...register(name)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>%</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FieldError errors={[error]} />
    </>
  );
}

/** Markup or discount, then a fixed amount: the two steps applied to the base price. */
export function AdjustmentFields({ currency }: { currency: string }) {
  const { register, getFieldState, formState } = useFormContext<PricingRuleFormValues>();
  const fixed = getFieldState('fixedAmount', formState);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field>
        <FieldLabel htmlFor="adjustmentPercent">Markup or discount</FieldLabel>
        <PercentInput name="adjustmentPercent" label="Markup or discount in percent" />
        <FieldDescription>Use a negative number for a discount, e.g. -10.</FieldDescription>
      </Field>
      <Field data-invalid={Boolean(fixed.error)}>
        <FieldLabel htmlFor="fixedAmount">Then add</FieldLabel>
        <MoneyInput
          id="fixedAmount"
          currency={currency}
          aria-invalid={Boolean(fixed.error)}
          {...register('fixedAmount')}
        />
        <FieldError errors={[fixed.error]} />
      </Field>
    </div>
  );
}

export function RoundingField() {
  const { control } = useFormContext<PricingRuleFormValues>();
  return (
    <Field>
      <FieldLabel id="rounding-label">Round up to</FieldLabel>
      <Controller
        control={control}
        name="rounding"
        render={({ field }) => (
          <ToggleGroup
            type="single"
            variant="outline"
            value={field.value}
            onValueChange={(next) => {
              const value = findOptionValue(ROUNDING_OPTIONS, next);
              if (value) field.onChange(value);
            }}
            aria-labelledby="rounding-label"
            className="flex-wrap"
          >
            {ROUNDING_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value} className="px-3">
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      />
    </Field>
  );
}

/** Never sell below cost plus a margin. Off by default. */
export function FloorField() {
  const { control } = useFormContext<PricingRuleFormValues>();
  const enabled = useWatch({ control, name: 'floorEnabled' });
  return (
    <div className="flex flex-col gap-3">
      <Controller
        control={control}
        name="floorEnabled"
        render={({ field }) => (
          <Field orientation="horizontal">
            <Switch id="floorEnabled" checked={field.value} onCheckedChange={field.onChange} />
            <FieldLabel htmlFor="floorEnabled" className="font-normal">
              Never price below cost plus a margin
            </FieldLabel>
          </Field>
        )}
      />
      {enabled && (
        <Field className="sm:max-w-56">
          <FieldLabel htmlFor="minMarginPercent">Minimum margin over cost</FieldLabel>
          <PercentInput name="minMarginPercent" label="Minimum margin over cost in percent" />
          <FieldDescription>Variants without a cost are not floored.</FieldDescription>
        </Field>
      )}
    </div>
  );
}

export function CompareAtField() {
  const { control } = useFormContext<PricingRuleFormValues>();
  return (
    <Field className="sm:max-w-80">
      <FieldLabel htmlFor="compareAt">Compare-at prices</FieldLabel>
      <EnumSelectField
        control={control}
        name="compareAt"
        id="compareAt"
        options={COMPARE_AT_OPTIONS}
      />
    </Field>
  );
}

interface ConversionFieldProps {
  /** The workspace's currency, which catalog prices are in. */
  from: string;
  /** The store's currency. */
  to: string;
}

/** How catalog prices reach the store's currency: the ECB's daily rate, or a fixed one. */
export function ConversionField({ from, to }: ConversionFieldProps) {
  const { control, register, getFieldState, formState } = useFormContext<PricingRuleFormValues>();
  const rateMode = useWatch({ control, name: 'rateMode' });
  const { error } = getFieldState('fixedExchangeRate', formState);
  return (
    <Field>
      <FieldLabel id="rate-mode-label">Currency</FieldLabel>
      <FieldDescription>
        Your catalog is in {from} and this store sells in {to}, so prices are converted first.
      </FieldDescription>
      <Controller
        control={control}
        name="rateMode"
        render={({ field }) => (
          <ToggleGroup
            type="single"
            variant="outline"
            aria-labelledby="rate-mode-label"
            value={field.value}
            onValueChange={(next) => {
              const value = findOptionValue(RATE_MODE_OPTIONS, next);
              if (value) field.onChange(value);
            }}
          >
            {RATE_MODE_OPTIONS.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      />
      {rateMode === RateMode.Fixed ? (
        <div data-invalid={Boolean(error)} className="flex flex-col gap-1">
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>1 {from} =</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="fixedExchangeRate"
              inputMode="decimal"
              aria-label={`${to} for one ${from}`}
              aria-invalid={Boolean(error)}
              className="tabular-nums"
              {...register('fixedExchangeRate')}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>{to}</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <FieldError errors={[error]} />
        </div>
      ) : (
        <FieldDescription>
          The European Central Bank’s reference rate, updated every working day.
        </FieldDescription>
      )}
    </Field>
  );
}
