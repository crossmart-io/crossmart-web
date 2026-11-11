import { useFormContext } from 'react-hook-form';
import { EnumSelectField } from '@/components/forms/EnumSelectField';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toEnumOptions } from '@/lib/enum';
import { GOOGLE_COUNTRY_LABELS, GOOGLE_SETUP_COPY } from '../channels.constants';
import type { GoogleSetupFormValues } from '../google-setup-form';

const COUNTRY_FIELD_ID = 'google-country';
const PRODUCT_URL_FIELD_ID = 'google-product-url';
const COUNTRY_OPTIONS = toEnumOptions(GOOGLE_COUNTRY_LABELS);

function CountryField() {
  const { control } = useFormContext<GoogleSetupFormValues>();
  return (
    <Field>
      <FieldLabel htmlFor={COUNTRY_FIELD_ID}>{GOOGLE_SETUP_COPY.country}</FieldLabel>
      <EnumSelectField
        control={control}
        name="country"
        id={COUNTRY_FIELD_ID}
        options={COUNTRY_OPTIONS}
      />
      <FieldDescription>{GOOGLE_SETUP_COPY.countryNote}</FieldDescription>
    </Field>
  );
}

function ProductUrlField() {
  const { register, formState } = useFormContext<GoogleSetupFormValues>();
  const error = formState.errors.productUrlTemplate;
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={PRODUCT_URL_FIELD_ID}>{GOOGLE_SETUP_COPY.productUrl}</FieldLabel>
      <Input
        id={PRODUCT_URL_FIELD_ID}
        inputMode="url"
        placeholder="https://your-store.com/products/{handle}"
        aria-invalid={Boolean(error)}
        {...register('productUrlTemplate')}
      />
      <FieldDescription>{GOOGLE_SETUP_COPY.productUrlNote}</FieldDescription>
      <FieldError errors={[error]} />
    </Field>
  );
}

/** Where Google listings sell and the page each product links to, inside the setup form. */
export function GoogleSetupFields() {
  return (
    <>
      <CountryField />
      <ProductUrlField />
    </>
  );
}
