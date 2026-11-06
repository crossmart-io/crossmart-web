import { zodResolver } from '@hookform/resolvers/zod';
import { type FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LISTING_FIELDS, productValuePatch } from '../listing-editor';
import type { ListingEditor } from '../listings.types';
import {
  isEmptyPatch,
  overrideFormSchema,
  type OverrideFormValues,
  productDefaultsOf,
  toOverrideForm,
  toOverridePatch,
} from '../override-form';
import { applyFormPatch, FORM_EDIT } from './useListingField';
import {
  type ProductChannelRef,
  useAddToStore,
  usePatchListingOverride,
} from './useProductChannels';

interface ListingEditorFormOptions {
  listingRef: ProductChannelRef;
  listing: ListingEditor;
  /** Adding saves the store's changes first, then adds the product, so it is published with them. */
  isAdding: boolean;
  /** Called once the product was added to the store. */
  onAdded: () => void;
}

/**
 * The listing editor's form. Saving sends only what changed as a PATCH, so a field brought back
 * to the product's value is sent as null and every other override stays as it is. The editor
 * stays open on what was saved, so the listing's state can be watched as it publishes.
 */
export function useListingEditorForm({
  listingRef,
  listing,
  isAdding,
  onAdded,
}: ListingEditorFormOptions) {
  // What was last saved, which the next save is compared with to send only the changes.
  const [saved, setSaved] = useState(() => toOverrideForm(listing));
  const form = useForm<OverrideFormValues>({
    resolver: zodResolver(overrideFormSchema),
    defaultValues: saved,
  });
  const patch = usePatchListingOverride(listingRef);
  const add = useAddToStore(listingRef);

  const submit = form.handleSubmit(async (values) => {
    try {
      const changes = toOverridePatch(saved, values);
      if (!isEmptyPatch(changes)) {
        await patch.mutateAsync(changes);
        setSaved(values);
        form.reset(values);
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
    const defaults = productDefaultsOf(listing);
    for (const field of LISTING_FIELDS) {
      applyFormPatch(form.setValue, productValuePatch(field, defaults));
    }
    form.setValue(
      'prices',
      form.getValues('prices').map((entry) => ({ ...entry, price: '', compareAtPrice: '' })),
      FORM_EDIT,
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
    error: patch.error ?? add.error,
    useProductValuesEverywhere,
  };
}
