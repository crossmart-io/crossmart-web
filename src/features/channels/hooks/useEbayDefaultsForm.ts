import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { ChannelConnection, EbayListingDefaults } from '../channels.types';
import {
  EBAY_POLICY_FIELDS,
  ebayDefaultsFormSchema,
  type EbayDefaultsFormOutput,
  type EbayDefaultsFormValues,
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
  const form = useForm<EbayDefaultsFormValues, unknown, EbayDefaultsFormOutput>({
    resolver: zodResolver(ebayDefaultsFormSchema),
    defaultValues: toEbayDefaultsForm(defaults),
  });
  const save = useSaveEbayDefaults(ref);
  const submit = form.handleSubmit(async (values) => {
    const saved = await save.mutateAsync(toEbayDefaultsBody(values));
    if (saved.ebay) form.reset(toEbayDefaultsForm(saved.ebay.listingDefaults));
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
