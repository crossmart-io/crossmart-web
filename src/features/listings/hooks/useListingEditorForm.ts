import { zodResolver } from '@hookform/resolvers/zod';
import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { LISTING_FIELDS, productValuePatch } from '../listing-editor';
import type { ListingEditorData } from './useListingEditor';
import { applyFormPatch } from './useListingField';
import {
  type ProductChannelRef,
  useAddToStore,
  useSaveListingOverride,
} from './useProductChannels';
import {
  overrideFormSchema,
  type OverrideFormValues,
  toOverrideBody,
  toOverrideForm,
} from '../override-form';

interface ListingEditorFormOptions {
  listingRef: ProductChannelRef;
  data: ListingEditorData;
  /** Adding saves the store's changes first, then adds the product, so it is published with them. */
  isAdding: boolean;
  /** Called once the product was added to the store. */
  onAdded: () => void;
}

/**
 * The listing editor's form: the store's changes, saved as the listing's override. Saving keeps
 * the editor open on what was saved, so the listing's state can be watched as it publishes.
 */
export function useListingEditorForm({
  listingRef,
  data,
  isAdding,
  onAdded,
}: ListingEditorFormOptions) {
  const { product, channel } = data;
  const form = useForm<OverrideFormValues>({
    resolver: zodResolver(overrideFormSchema),
    defaultValues: toOverrideForm(channel, product),
  });
  const save = useSaveListingOverride(listingRef);
  const add = useAddToStore(listingRef);

  const submit = form.handleSubmit(async (values) => {
    try {
      if (form.formState.isDirty) {
        const saved = await save.mutateAsync(toOverrideBody(values));
        form.reset(toOverrideForm(saved, product));
      }
      if (isAdding) {
        await add.mutateAsync();
        onAdded();
      }
    } catch {
      // Shown in the editor from the mutations' state.
    }
  });

  /** Every field follows the product again; saved with the next save. */
  const useProductValuesEverywhere = () => {
    for (const field of LISTING_FIELDS) {
      applyFormPatch(form.setValue, productValuePatch(field, product));
    }
    form.setValue(
      'prices',
      form.getValues('prices').map((entry) => ({ ...entry, price: '', compareAtPrice: '' })),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return {
    form,
    submit: (event: FormEvent<HTMLFormElement>) => {
      // The editor renders in a portal but sits inside the product page's form in React's tree;
      // its submit must not bubble there and save the product too.
      event.stopPropagation();
      void submit(event);
    },
    error: save.error ?? add.error,
    useProductValuesEverywhere,
  };
}
