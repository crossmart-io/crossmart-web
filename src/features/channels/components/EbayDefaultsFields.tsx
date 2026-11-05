import { Controller, useFormContext } from 'react-hook-form';
import { EnumSelectField } from '@/components/forms/EnumSelectField';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toEnumOptions } from '@/lib/enum';
import { EBAY_CONDITION_LABELS, EBAY_DEFAULTS_COPY } from '../channels.constants';
import type { EbayPolicy, EbaySettings } from '../channels.types';
import type { EbayDefaultsFormValues, EbayPolicyField } from '../ebay-defaults-form';

/** Each policy select: its field, its label, and the account's policies of that kind. */
const POLICY_SELECTS: readonly {
  field: EbayPolicyField;
  label: string;
  kind: keyof EbaySettings['policies'];
}[] = [
  { field: 'fulfillmentPolicyId', label: 'Shipping policy', kind: 'fulfillment' },
  { field: 'paymentPolicyId', label: 'Payment policy', kind: 'payment' },
  { field: 'returnPolicyId', label: 'Return policy', kind: 'return' },
];

function PolicySelect({
  field: name,
  label,
  policies,
}: {
  field: EbayPolicyField;
  label: string;
  policies: readonly EbayPolicy[];
}) {
  const { control } = useFormContext<EbayDefaultsFormValues>();
  const id = `ebay-${name}`;
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={field.value || undefined}
            onValueChange={field.onChange}
            disabled={policies.length === 0}
          >
            <SelectTrigger id={id} className="w-full">
              <SelectValue
                placeholder={
                  policies.length === 0
                    ? EBAY_DEFAULTS_COPY.noPolicies
                    : EBAY_DEFAULTS_COPY.choosePolicy
                }
              />
            </SelectTrigger>
            <SelectContent>
              {policies.map((policy) => (
                <SelectItem key={policy.id} value={policy.id}>
                  {policy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </Field>
  );
}

/** A shipping, a payment and a return policy, from those the account has on eBay. */
export function EbayPolicyFields({ policies }: { policies: EbaySettings['policies'] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {POLICY_SELECTS.map(({ field, label, kind }) => (
        <PolicySelect key={field} field={field} label={label} policies={policies[kind]} />
      ))}
    </div>
  );
}

const CONDITION_OPTIONS = toEnumOptions(EBAY_CONDITION_LABELS);

export function EbayConditionField() {
  const { control } = useFormContext<EbayDefaultsFormValues>();
  return (
    <Field>
      <FieldLabel htmlFor="ebay-condition">Condition</FieldLabel>
      <EnumSelectField
        control={control}
        name="condition"
        id="ebay-condition"
        options={CONDITION_OPTIONS}
        className="sm:w-72"
      />
      <FieldDescription>Some eBay categories accept only some conditions.</FieldDescription>
    </Field>
  );
}

/** Where items ship from: saved on eBay as the account's Crossmart inventory location. */
export function EbayShipFromFields() {
  const { register, formState } = useFormContext<EbayDefaultsFormValues>();
  return (
    <fieldset className="grid gap-4 sm:grid-cols-3">
      <legend className="mb-2 text-sm font-medium">Ships from</legend>
      <Field>
        <FieldLabel htmlFor="ebay-postal-code">Postal code</FieldLabel>
        <Input id="ebay-postal-code" autoComplete="postal-code" {...register('postalCode')} />
      </Field>
      <Field data-invalid={Boolean(formState.errors.country)}>
        <FieldLabel htmlFor="ebay-country">Country</FieldLabel>
        <Input
          id="ebay-country"
          placeholder="US"
          maxLength={2}
          autoComplete="country"
          {...register('country')}
        />
        <FieldError errors={[formState.errors.country]} />
      </Field>
      <Field>
        <FieldLabel htmlFor="ebay-city">City (optional)</FieldLabel>
        <Input id="ebay-city" autoComplete="address-level2" {...register('city')} />
      </Field>
    </fieldset>
  );
}
