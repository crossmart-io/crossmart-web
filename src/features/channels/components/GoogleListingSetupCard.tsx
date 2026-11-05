import { TriangleAlert } from 'lucide-react';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';
import { GoogleTargetCountry } from '@/api/schema';
import { CardSaveFooter } from '@/components/forms/CardSaveFooter';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GOOGLE_COUNTRY_LABELS, GOOGLE_SETUP_COPY } from '../channels.constants';
import type { GoogleMerchantSettings } from '../channels.types';
import type { GoogleSetupFormValues } from '../google-setup-form';
import { useGoogleSetupForm } from '../hooks/useGoogleSetup';

const COUNTRY_FIELD_ID = 'google-country';
const PRODUCT_URL_FIELD_ID = 'google-product-url';

interface GoogleListingSetupCardProps {
  workspaceId: string;
  connectionId: string;
  googleMerchant: GoogleMerchantSettings;
  canManage: boolean;
}

function CountryField() {
  const { control } = useFormContext<GoogleSetupFormValues>();
  return (
    <Field>
      <FieldLabel htmlFor={COUNTRY_FIELD_ID}>{GOOGLE_SETUP_COPY.country}</FieldLabel>
      <Controller
        control={control}
        name="country"
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => field.onChange(value as GoogleTargetCountry)}
          >
            <SelectTrigger id={COUNTRY_FIELD_ID} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(GoogleTargetCountry).map((country) => (
                <SelectItem key={country} value={country}>
                  {GOOGLE_COUNTRY_LABELS[country]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
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

/** Where every Google listing sells, and the website page each product links to. */
export function GoogleListingSetupCard({
  workspaceId,
  connectionId,
  googleMerchant,
  canManage,
}: GoogleListingSetupCardProps) {
  const { form, saveError, submit } = useGoogleSetupForm(
    { workspaceId, connectionId },
    googleMerchant,
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{GOOGLE_SETUP_COPY.title}</h2>
        </CardTitle>
        <CardDescription>
          {GOOGLE_SETUP_COPY.description}{' '}
          {googleMerchant.readyToList ? GOOGLE_SETUP_COPY.ready : GOOGLE_SETUP_COPY.notReady}
        </CardDescription>
      </CardHeader>
      <FormProvider {...form}>
        <form onSubmit={(event) => void submit(event)} noValidate>
          <CardContent className="flex flex-col gap-5">
            {!googleMerchant.homepageClaimed && (
              <Alert>
                <TriangleAlert />
                <AlertDescription>{GOOGLE_SETUP_COPY.homepageNotClaimed}</AlertDescription>
              </Alert>
            )}
            <fieldset disabled={!canManage} className="flex min-w-0 flex-col gap-5">
              <CountryField />
              <ProductUrlField />
            </fieldset>
          </CardContent>
          {canManage && (
            <CardSaveFooter
              label={GOOGLE_SETUP_COPY.save}
              error={saveError}
              isSaving={form.formState.isSubmitting}
              disabled={googleMerchant.readyToList && !form.formState.isDirty}
            />
          )}
        </form>
      </FormProvider>
    </Card>
  );
}
