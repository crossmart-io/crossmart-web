import { PageSection } from '@/config/routes';
import { TriangleAlert } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { EnumSelectField } from '@/components/forms/EnumSelectField';
import { SettingsFormCard } from '@/components/forms/SettingsFormCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toEnumOptions } from '@/lib/enum';
import { GOOGLE_COUNTRY_LABELS, GOOGLE_SETUP_COPY } from '../channels.constants';
import type { GoogleMerchantSettings } from '../channels.types';
import type { GoogleSetupFormValues } from '../google-setup-form';
import { useGoogleSetupForm } from '../hooks/useGoogleSetup';

const COUNTRY_FIELD_ID = 'google-country';
const PRODUCT_URL_FIELD_ID = 'google-product-url';
const COUNTRY_OPTIONS = toEnumOptions(GOOGLE_COUNTRY_LABELS);

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
    <SettingsFormCard
      title={GOOGLE_SETUP_COPY.title}
      id={PageSection.StoreListingSetup}
      description={googleMerchant.readyToList ? undefined : GOOGLE_SETUP_COPY.notReady}
      form={form}
      onSubmit={submit}
      canManage={canManage}
      saveLabel={GOOGLE_SETUP_COPY.save}
      saveError={saveError}
      requireChanges={googleMerchant.readyToList}
      contentClassName="gap-5"
      before={
        !googleMerchant.homepageClaimed && (
          <Alert>
            <TriangleAlert />
            <AlertDescription>{GOOGLE_SETUP_COPY.homepageNotClaimed}</AlertDescription>
          </Alert>
        )
      }
    >
      <CountryField />
      <ProductUrlField />
    </SettingsFormCard>
  );
}
