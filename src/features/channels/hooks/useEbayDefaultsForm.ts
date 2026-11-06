import { useSaveableForm } from '@/hooks/useSaveableForm';
import type { ChannelConnection, EbayListingDefaults } from '../channels.types';
import {
  EBAY_POLICY_FIELDS,
  ebayDefaultsFormSchema,
  toEbayDefaultsBody,
  toEbayDefaultsForm,
  toEbayPolicyFormValues,
} from '../ebay-defaults-form';
import { useSaveEbayDefaults } from './useEbaySetup';

interface ConnectionRef {
  workspaceId: string;
  connectionId: string;
}

/**
 * The listing defaults form: saving it, and showing the policies the API chose after creating
 * default policies (unsaved condition or address edits are kept).
 */
export function useEbayDefaultsForm(ref: ConnectionRef, defaults: EbayListingDefaults) {
  const save = useSaveEbayDefaults(ref);
  const { form, submit } = useSaveableForm({
    schema: ebayDefaultsFormSchema,
    defaults: toEbayDefaultsForm(defaults),
    save: (values) => save.mutateAsync(toEbayDefaultsBody(values)),
    toForm: (saved) => (saved.ebay ? toEbayDefaultsForm(saved.ebay.listingDefaults) : null),
  });
  const choosePolicies = (connection: ChannelConnection): void => {
    if (!connection.ebay) return;
    const chosen = toEbayPolicyFormValues(connection.ebay.listingDefaults);
    for (const field of EBAY_POLICY_FIELDS) {
      form.resetField(field, { defaultValue: chosen[field] });
    }
  };
  return { form, saveError: save.error, submit, choosePolicies };
}
